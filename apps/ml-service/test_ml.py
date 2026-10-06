"""
Unit and Integration Tests for HealthX AI ML Service
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from training.deidentify import DeidentificationPipeline

client = TestClient(app)

def test_health_and_ready():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

    r2 = client.get("/ready")
    assert r2.status_code == 200
    assert r2.json()["status"] == "ready"

def test_deidentification_pipeline():
    pipeline = DeidentificationPipeline()
    sample = "Patient phone: +91-9876543210, email: test@healthx.org, ABHA: 12-3456-7890-1234."
    scrubbed, counts = pipeline.scrub(sample)
    assert "[REDACTED_PHONE]" in scrubbed
    assert "[REDACTED_EMAIL]" in scrubbed
    assert "[REDACTED_ABHA_NUMBER]" in scrubbed
    assert counts["phone"] == 1
    assert counts["email"] == 1
    assert counts["abha_number"] == 1

def test_ocr_endpoint():
    payload = {
        "document_id": "doc-001",
        "raw_text": "NAMO HOSPITAL\nDate: 15 September 2026\nHemoglobin: 10.8 g/dL",
        "language": "en"
    }
    r = client.post("/ml/v1/ocr", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "Hemoglobin: 10.8 g/dL" in data["text"]
    assert data["confidence"] > 0.8
    assert len(data["pages"]) == 1

def test_classify_endpoint():
    payload = {
        "text": "Complete Blood Count laboratory findings: Hemoglobin 10.8 g/dL, Ferritin 12 ng/mL."
    }
    r = client.post("/ml/v1/classify", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["type"] == "LAB_REPORT"
    assert data["confidence"] > 0.5

def test_extract_endpoint():
    payload = {
        "text": "NAMO HOSPITAL. Date: 15 September 2026. Dr. Raskik. Hemoglobin: 10.8 g/dL (Reference 13.0 - 17.0). Ferritin: 12 ng/mL. Iron supplement."
    }
    r = client.post("/ml/v1/extract", json=payload)
    assert r.status_code == 200
    data = r.json()
    entities = data["entities"]
    entity_types = [e["entity_type"] for e in entities]
    assert "LAB_TEST" in entity_types
    assert "MEDICATION" in entity_types

def test_normalize_endpoint():
    payload = {
        "field_type": "LAB_TEST",
        "raw_value": "Hb"
    }
    r = client.post("/ml/v1/normalize", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["normalized_value"] == "Hemoglobin"
    assert data["standard_unit"] == "g/dL"

def test_embed_endpoint():
    payload = {
        "texts": ["Hemoglobin test result", "Iron supplement medication"]
    }
    r = client.post("/ml/v1/embed", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert len(data["embeddings"]) == 2
    assert data["dimensions"] == 64
