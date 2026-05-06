from datetime import datetime
import os
from typing import List, Optional
import random

from fastapi import Depends, FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import google.generativeai as genai

from database import Base, engine, get_db
import models
from models import Asset as AssetModel

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MSU Surplus Tracker API")

# Setup Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash') 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SCHEMAS ---

class MarketPriceOut(BaseModel):
    msu: float = 0.0
    ebay: Optional[float] = None
    amazon: Optional[float] = None

class MarketItemOut(BaseModel):
    id: int
    name: str
    cond: str
    prices: MarketPriceOut

class AIDescriptionRequest(BaseModel):
    item_name: str
    condition: str

class StatusUpdate(BaseModel):
    current_status: str

class ClaimRequest(BaseModel):
    location: str
    current_status: str

class AssetOut(BaseModel):
    asset_id: int
    asset_tag: str | None = None
    item_name: str
    description: str | None = None
    condition: str | None = None
    location: str | None = None  
    current_status: str
    created_at: datetime | None = None
    class Config:
        from_attributes = True

# --- ROUTES ---

@app.get("/")
def root():
    return {"message": "MSU Surplus Tracker API running"}

@app.get("/assets", response_model=list[AssetOut])
def get_assets(db: Session = Depends(get_db)):
    return db.query(AssetModel).all()

@app.get("/assets/{tag}", response_model=AssetOut)
def get_asset_by_tag(tag: str, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.asset_tag == tag).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

# Standard Status Update 
@app.put("/assets/{asset_id}/status")
def update_status(asset_id: int, status_data: StatusUpdate, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    asset.current_status = status_data.current_status
    db.commit()
    return {"message": "Status updated"}


@app.patch("/assets/{asset_id}/claim")
def claim_asset(asset_id: int, claim_data: ClaimRequest, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    asset.location = claim_data.location
    asset.current_status = claim_data.current_status
    db.commit()
    return {"message": f"Asset successfully claimed for {claim_data.location}"}

# --- ADMIN APPROVAL ACTION ---
@app.post("/assets/{asset_id}/approve")
def approve_asset(asset_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Logic: Finalize redistribution after admin review
    asset.current_status = "active"
    db.commit()
    return {
        "message": "Action approved by System Admin",
        "approved_by": payload.get("admin_id", "M10357379")
    }

@app.post("/generate-description")
async def generate_description(req: AIDescriptionRequest):
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="API Key not configured")
    try:
        prompt = f"Rewrite into a 2-sentence inventory description: {req.item_name}, condition {req.condition}."
        response = model.generate_content(prompt)
        return {"description": response.text.strip()}
    except Exception:
        raise HTTPException(status_code=500, detail="Generation failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
