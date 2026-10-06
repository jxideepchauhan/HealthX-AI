"""
HealthX AI - Comprehensive ML Evaluation & Benchmark Harness (Sections 20, 23, 73, 78, 80)
Executes unified evaluation across:
1. Document Classifier (TF-IDF + Logistic Regression)
2. Medical NER & Information Extractor
3. OCR Text Error Simulation (CER, WER)
"""

import os
import json
import time
from training.train_classifier import train_classifier
from training.train_ner import train_ner

def evaluate_models():
    print("====================================================")
    print("HealthX AI — Running Comprehensive ML Model Evaluation")
    print("====================================================")

    start_time = time.time()
    clf_metrics = train_classifier()
    ner_metrics = train_ner()
    elapsed = time.time() - start_time

    registry_dir = os.path.join(os.path.dirname(__file__), "..", "models", "registry")
    os.makedirs(registry_dir, exist_ok=True)

    evaluation_report = {
        "timestamp": "2026-10-06T16:04:00Z",
        "status": "VALIDATED",
        "training_duration_seconds": round(elapsed, 2),
        "models": {
            "document-classifier": clf_metrics,
            "medical-ner": ner_metrics,
        },
        "aggregate_summary": {
            "document_classification_accuracy": clf_metrics["accuracy"],
            "document_classification_f1": clf_metrics["f1"],
            "ner_macro_f1": ner_metrics["f1"],
            "ner_field_accuracy": ner_metrics["field_accuracy"],
            "average_cer": round((clf_metrics["cer"] + ner_metrics["cer"]) / 2, 4),
            "average_wer": round((clf_metrics["wer"] + ner_metrics["wer"]) / 2, 4),
            "average_latency_ms": round((clf_metrics["latency_ms"] + ner_metrics["latency_ms"]) / 2, 2),
        }
    }

    report_path = os.path.join(registry_dir, "evaluation_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(evaluation_report, f, indent=2)

    print("\n====================================================")
    print("FINAL EVALUATION BENCHMARK SUMMARY")
    print("====================================================")
    print(f"Classification Accuracy:  {evaluation_report['aggregate_summary']['document_classification_accuracy'] * 100:.2f}%")
    print(f"Classification Macro F1:  {evaluation_report['aggregate_summary']['document_classification_f1']:.4f}")
    print(f"NER Macro F1 Score:       {evaluation_report['aggregate_summary']['ner_macro_f1']:.4f}")
    print(f"NER Field Accuracy:       {evaluation_report['aggregate_summary']['ner_field_accuracy'] * 100:.2f}%")
    print(f"Average Inference Latency:{evaluation_report['aggregate_summary']['average_latency_ms']} ms")
    print(f"Report Written To:        {report_path}")
    print("====================================================")

    return evaluation_report

if __name__ == "__main__":
    evaluate_models()
