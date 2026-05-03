from datetime import datetime
import os
from typing import List, Optional
import random

from fastapi import Depends, FastAPI, HTTPException
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
model = genai.GenerativeModel('gemini-1.5-flash-lite') 

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

class AssetOut(BaseModel):
    asset_id: int
    asset_tag: str | None = None
    item_name: str
    description: str | None = None
    condition: str | None = None
    current_status: str
    created_at: datetime | None = None
    class Config:
        from_attributes = True

# --- ROUTES ---

@app.get("/")
def root():
    return {"message": "MSU Surplus Tracker API running"}

@app.get("/api/market", response_model=List[MarketItemOut])
def get_market_analysis(db: Session = Depends(get_db)):
    try:
        # Fetch up to 25 assets for comparison
        assets = db.query(AssetModel).order_by(AssetModel.asset_id.desc()).limit(25).all()
        
        market_results = []
        for asset in assets:
            market_results.append(MarketItemOut(
                id=asset.asset_id,
                name=asset.item_name,
                cond=asset.condition or "Used",
                prices=MarketPriceOut(
                    msu=10.0, # Replace with actual price logic/column
                    ebay=None,
                    amazon=None
                )
            ))
        return market_results
    except Exception as e:
        print(f"Error fetching market data: {e}")
        return [] # Return empty list to prevent frontend crash

@app.get("/assets", response_model=list[AssetOut])
def get_assets(db: Session = Depends(get_db)):
    return db.query(AssetModel).all()

@app.post("/generate-description")
async def generate_description(req: AIDescriptionRequest):
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="API Key not configured")
    try:
        prompt = f"Rewrite into a 1-sentence inventory description: {req.item_name}, condition {req.condition}."
        response = model.generate_content(prompt)
        return {"description": response.text.strip()}
    except Exception:
        raise HTTPException(status_code=500, detail="Generation failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
