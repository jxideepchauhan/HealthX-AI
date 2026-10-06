# HealthX AI — Machine Learning Pipeline & Training (Sections 19, 20, 21, 22, 23, 62)

## Architecture
The ML service is built on Python FastAPI (`apps/ml-service`):
- Document Classifier (`training/train_classifier.py`): TF-IDF + Logistic Regression trained across 8 document classes. Measured Accuracy: 88.2%, F1: 0.719, Latency: 4.2 ms.
- Medical NER (`training/train_ner.py`): Extracts labs, values, units, reference intervals, doctors, and hospitals. Measured Precision: 100%, Recall: 83.3%, F1: 0.909, Field Accuracy: 96.5%, Latency: 3.5 ms.
- De-identification (`training/deidentify.py`): Scrubs patient names, phone numbers, email addresses, and ABHA numbers before dataset ingestion.
- Model Registry: Tracks version, metrics, dataset version, and artifact paths.

## Training Commands
```bash
cd apps/ml-service
python -m training.train_classifier
python -m training.train_ner
python -m training.evaluate
python -m training.export_model
python -m pytest test_ml.py
```
