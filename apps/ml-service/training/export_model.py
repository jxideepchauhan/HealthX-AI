"""
HealthX AI - Model Export & Packaging Script (Section 62)
Packages model weights and schema manifests for production distribution.
"""

import os
import json
import shutil

def export_models():
    print("--- HealthX AI Model Export ---")
    registry_dir = os.path.join(os.path.dirname(__file__), "..", "models", "registry")
    export_dir = os.path.join(os.path.dirname(__file__), "..", "models", "exported")
    os.makedirs(export_dir, exist_ok=True)

    for item in os.listdir(registry_dir):
        s = os.path.join(registry_dir, item)
        d = os.path.join(export_dir, item)
        if os.path.isfile(s):
            shutil.copy2(s, d)

    manifest = {
        "export_timestamp": "2026-10-06T13:47:00Z",
        "format": "joblib+json",
        "ready_for_serving": True,
    }
    with open(os.path.join(export_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Models successfully exported to: {export_dir}")

if __name__ == "__main__":
    export_models()
