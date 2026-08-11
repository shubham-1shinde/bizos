from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_forecast():
    res = client.post("/forecast", json={"type": "REVENUE", "period": "Next 6 Months"})
    assert res.status_code == 200
    data = res.json()
    assert "predictions" in data
    assert data["confidence"] > 90

def test_simulate():
    res = client.post("/simulate", json={"scenarioType": "PRICE_CHANGE", "parameters": {"priceChangePct": 10}})
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert "revenueImpact" in data["results"]

def test_analyze():
    res = client.post("/analyze", json={"question": "Why did profit decrease?", "context": {"salesCount": 15}})
    assert res.status_code == 200
    assert "reply" in res.json()
