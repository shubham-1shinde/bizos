from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

from forecasting import generate_forecast, predict_demand_scores
from simulator import run_what_if_simulation
from assistant import analyze_business_question

app = FastAPI(title="BizOS AI & ML FastAPI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    type: Optional[str] = "REVENUE"
    period: Optional[str] = "Next 6 Months"
    companyId: Optional[str] = None
    historicalData: Optional[List[float]] = None

class SimulationRequest(BaseModel):
    scenarioType: str
    parameters: Optional[Dict[str, Any]] = None
    companyId: Optional[str] = None

class AnalyzeRequest(BaseModel):
    question: str
    context: Optional[Dict[str, Any]] = {}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "BizOS Python FastAPI AI/ML"}

@app.post("/forecast")
def forecast_endpoint(req: ForecastRequest):
    return generate_forecast(
        forecast_type=req.type or "REVENUE",
        period=req.period or "Next 6 Months",
        company_id=req.companyId,
        historical_data=req.historicalData
    )


@app.post("/predict-demand")
def demand_endpoint(products: List[Dict[str, Any]]):
    return predict_demand_scores(products)

@app.post("/simulate")
def simulate_endpoint(req: SimulationRequest):
    return run_what_if_simulation(req.scenarioType, req.parameters or {})

@app.post("/analyze")
def analyze_endpoint(req: AnalyzeRequest):
    return analyze_business_question(req.question, req.context or {})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
