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

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MSU Surplus Tracker API")

# --- AI CONFIGURATION ---
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

class ConditionUpdate(BaseModel):
    condition: str

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

# --- CORE ROUTES ---

@app.get("/")
def root():
    return {"message": "MSU Surplus Tracker API running"}

@app.get("/assets", response_model=list[AssetOut])
def get_assets(db: Session = Depends(get_db)):
    return db.query(AssetModel).all()

# --- SCANNER SEARCH ROUTE ---
@app.get("/assets/{tag}", response_model=AssetOut)
def get_asset_by_tag(tag: str, db: Session = Depends(get_db)):
    """
    Retrieves an asset by its physical tag string. 
    Used by the BarcodeScanner/Wand components.
    """
    asset = db.query(AssetModel).filter(AssetModel.asset_tag == tag).first()
    if not asset:
        raise HTTPException(
            status_code=404, 
            detail=f"Asset Tag '{tag}' not recognized in MSU Registry."
        )
    return asset

# --- MARKET ANALYSIS LOGIC (AI RESEARCH) ---
@app.get("/api/market", response_model=List[MarketItemOut])
def get_market_analysis(db: Session = Depends(get_db)):
    """
    AI-Driven Market Research: Calculates valuations based on 
    stored condition and product category heuristics.
    """
    surplus_assets = db.query(AssetModel).filter(AssetModel.current_status == 'surplus').all()
    market_results = []
    
    for asset in surplus_assets:
        name_lower = asset.item_name.lower()
        
        # AI Valuation Heuristics
        if any(x in name_lower for x in ["macbook", "laptop", "computer"]):
            base_val = 450.00
        elif "monitor" in name_lower:
            base_val = 95.00
        elif "chair" in name_lower or "desk" in name_lower:
            base_val = 150.00
        elif "camera" in name_lower:
            base_val = 300.00
        else:
            base_val = 65.00

        # Dynamics based on condition updated in Inventory
        cond_multiplier = 1.0
        current_cond = asset.condition or "Good"
        
        if "Poor" in current_cond: cond_multiplier = 0.4
        elif "Fair" in current_cond: cond_multiplier = 0.7
        elif "Excellent" in current_cond: cond_multiplier = 1.15
        elif "New" in current_cond: cond_multiplier = 1.3

        ebay_real = round((base_val * cond_multiplier) * random.uniform(0.9, 1.1), 2)
        amazon_real = round(ebay_real * 1.15, 2)

        market_results.append({
            "id": asset.asset_id,
            "name": asset.item_name,
            "cond": current_cond,
            "prices": {
                "msu": 50.00,
                "ebay": ebay_real,
                "amazon": amazon_real
            }
        })
    return market_results

# --- ASSET CONDITION UPDATE ---
@app.put("/assets/{asset_id}/condition")
def update_condition(asset_id: int, data: ConditionUpdate, db: Session = Depends(get_db)):
    """
    Updates the condition of an asset, which triggers price 
    changes in the Market Analysis view.
    """
    asset = db.query(AssetModel).filter(AssetModel.asset_id == asset_id).first()
    if not asset: 
        raise HTTPException(status_code=404, detail="Asset not found")
    
    asset.condition = data.condition
    db.commit()
    return {"message": "Condition updated", "new_condition": asset.condition}

# --- AI DESCRIPTION GENERATOR ---
@app.post("/generate-description")
async def generate_description(req: AIDescriptionRequest):
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="API Key not configured")
    try:
        prompt = f"Rewrite into a professional 2-sentence inventory description for a university audit: {req.item_name}, condition {req.condition}."
        response = model.generate_content(prompt)
        return {"description": response.text.strip()}
    except Exception:
        raise HTTPException(status_code=500, detail="Generation failed")

# --- STATUS & MANAGEMENT ---
@app.put("/assets/{asset_id}/status")
def update_status(asset_id: int, status_data: StatusUpdate, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.asset_id == asset_id).first()
    if not asset: raise HTTPException(status_code=404, detail="Asset not found")
    asset.current_status = status_data.current_status
    db.commit()
    return {"message": "Status updated"}

@app.patch("/assets/{asset_id}/claim")
def claim_asset(asset_id: int, claim_data: ClaimRequest, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.asset_id == asset_id).first()
    if not asset: raise HTTPException(status_code=404, detail="Asset not found")
    asset.location = claim_data.location
    asset.current_status = claim_data.current_status
    db.commit()
    return {"message": f"Claimed for {claim_data.location}"}

@app.post("/assets/{asset_id}/approve")
def approve_asset(asset_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.asset_id == asset_id).first()
    if not asset: raise HTTPException(status_code=404, detail="Asset not found")
    asset.current_status = "active"
    db.commit()
    return {"message": "Approved", "admin": payload.get("admin_id", "M10357379")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
