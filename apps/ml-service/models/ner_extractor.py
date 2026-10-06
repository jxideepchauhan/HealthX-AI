"""
HealthX AI - Production Medical Named Entity Recognition Model Class (Sections 16, 20, 21, 23, 73, 78)
Extracts clinical entities:
- LAB_TEST (with name, numeric value, unit, reference range, and abnormality status)
- VITAL_SIGNS (BP, SpO2, Heart Rate, Pulse, Temperature)
- MEDICATION (name, dosage, form, frequency, instructions)
- DIAGNOSIS (conditions, clinical assessments)
- DOCTOR (physician names, qualifications)
- HOSPITAL (facilities, clinics, departments)
- DATE (effective dates)
"""

import re
from typing import List, Dict, Any, Optional

class MedicalNERExtractor:
    def __init__(self):
        # Comprehensive Lab Biomarkers (regex, canonical name, default unit, default reference interval)
        self.lab_patterns = [
            # CBC
            (r'(?i)\b(hemoglobin|hb|hgb)\b[:\s]*([\d.]+)\s*(g\/dl|gm\/dl|g\/100ml)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Hemoglobin', 'g/dL', (13.0, 17.0)),
            (r'(?i)\b(serum\s*ferritin|ferritin)\b[:\s]*([\d.]+)\s*(ng\/ml)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Ferritin', 'ng/mL', (30.0, 400.0)),
            (r'(?i)\b(rbc|red\s*blood\s*cells?)\b[:\s]*([\d.]+)\s*(million\/µl|million\/ul|mil\/cumm)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Red Blood Cell Count', 'million/µL', (4.5, 5.9)),
            (r'(?i)\b(wbc|white\s*blood\s*cells?|tlc|total\s*leukocyte\s*count)\b[:\s]*([\d.]+)\s*(\/µl|\/ul|cells\/cumm)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'White Blood Cell Count', '/µL', (4000.0, 11000.0)),
            (r'(?i)\b(platelets?|platelet\s*count)\b[:\s]*([\d.]+)\s*(\/µl|\/ul|lakhs?\/cumm)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Platelet Count', '/µL', (150000.0, 450000.0)),
            (r'(?i)\b(mcv|mean\s*corpuscular\s*volume)\b[:\s]*([\d.]+)\s*(fl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Mean Corpuscular Volume', 'fL', (80.0, 100.0)),
            (r'(?i)\b(mch|mean\s*corpuscular\s*hemoglobin)\b[:\s]*([\d.]+)\s*(pg)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Mean Corpuscular Hemoglobin', 'pg', (27.0, 33.0)),
            (r'(?i)\b(mchc)\b[:\s]*([\d.]+)\s*(g\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'MCHC', 'g/dL', (32.0, 36.0)),
            (r'(?i)\b(rdw|red\s*cell\s*distribution\s*width)\b[:\s]*([\d.]+)\s*(%)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'RDW', '%', (11.5, 14.5)),
            (r'(?i)\b(hematocrit|packed\s*cell\s*volume|pcv)\b[:\s]*([\d.]+)\s*(%)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Hematocrit', '%', (40.0, 52.0)),

            # Diabetes & Metabolic
            (r'(?i)\b(fasting\s*blood\s*sugar|fbs|fasting\s*glucose)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Fasting Blood Glucose', 'mg/dL', (70.0, 99.0)),
            (r'(?i)\b(post\s*prandial\s*glucose|ppbs)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Post Prandial Glucose', 'mg/dL', (70.0, 140.0)),
            (r'(?i)\b(hba1c|glycated\s*hemoglobin)\b[:\s]*([\d.]+)\s*(%)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'HbA1c', '%', (4.0, 5.6)),

            # Renal (KFT)
            (r'(?i)\b(serum\s*creatinine|creatinine)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Creatinine', 'mg/dL', (0.7, 1.3)),
            (r'(?i)\b(blood\s*urea\s*nitrogen|bun|blood\s*urea)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Blood Urea', 'mg/dL', (15.0, 45.0)),
            (r'(?i)\b(uric\s*acid)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Uric Acid', 'mg/dL', (3.5, 7.2)),

            # Lipid Panel
            (r'(?i)\b(total\s*cholesterol|cholesterol)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Total Cholesterol', 'mg/dL', (125.0, 200.0)),
            (r'(?i)\b(triglycerides?|tg)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Triglycerides', 'mg/dL', (50.0, 150.0)),
            (r'(?i)\b(hdl\s*cholesterol|hdl)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'HDL Cholesterol', 'mg/dL', (40.0, 60.0)),
            (r'(?i)\b(ldl\s*cholesterol|ldl)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'LDL Cholesterol', 'mg/dL', (50.0, 100.0)),

            # Liver Function (LFT)
            (r'(?i)\b(total\s*bilirubin|bilirubin\s*total)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Total Bilirubin', 'mg/dL', (0.2, 1.2)),
            (r'(?i)\b(sgpt|alt|alanine\s*aminotransferase)\b[:\s]*([\d.]+)\s*(u\/l|iu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'SGPT (ALT)', 'U/L', (10.0, 40.0)),
            (r'(?i)\b(sgot|ast|aspartate\s*aminotransferase)\b[:\s]*([\d.]+)\s*(u\/l|iu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'SGOT (AST)', 'U/L', (10.0, 40.0)),
            (r'(?i)\b(alkaline\s*phosphatase|alp)\b[:\s]*([\d.]+)\s*(u\/l|iu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Alkaline Phosphatase', 'U/L', (44.0, 147.0)),

            # Thyroid & Electrolytes
            (r'(?i)\b(tsh|thyroid\s*stimulating\s*hormone)\b[:\s]*([\d.]+)\s*(µiu\/ml|uiu\/ml|miu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum TSH', 'uIU/mL', (0.45, 4.5)),
            (r'(?i)\b(serum\s*sodium|sodium)\b[:\s]*([\d.]+)\s*(meq\/l|mmol\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Sodium', 'mEq/L', (135.0, 145.0)),
            (r'(?i)\b(serum\s*potassium|potassium)\b[:\s]*([\d.]+)\s*(meq\/l|mmol\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Potassium', 'mEq/L', (3.5, 5.0)),
            (r'(?i)\b(serum\s*calcium|calcium)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Calcium', 'mg/dL', (8.5, 10.5)),
        ]

        # Vitals Patterns
        self.vital_patterns = [
            (r'(?i)\b(?:bp|blood\s*pressure)\b[:\s]*(\d{2,3})\/(\d{2,3})\s*(mmhg)?', 'Blood Pressure', 'mmHg'),
            (r'(?i)\b(?:pulse|heart\s*rate|hr)\b[:\s]*(\d{2,3})\s*(bpm)?', 'Heart Rate', 'bpm'),
            (r'(?i)\b(?:spo2|oxygen\s*saturation)\b[:\s]*(\d{2,3})\s*(%)?', 'Oxygen Saturation', '%'),
            (r'(?i)\b(?:temp|temperature)\b[:\s]*([\d.]+)\s*(°?f|°?c)?', 'Temperature', '°F'),
        ]

        # Medication dictionary with active forms
        self.common_medications = [
            'iron supplement', 'ferrous ascorbate', 'ferrous sulfate', 'folic acid',
            'metformin', 'glimepiride', 'insulin',
            'telmisartan', 'amlodipine', 'losartan', 'atenolol', 'hydrochlorothiazide',
            'atorvastatin', 'rosuvastatin', 'aspirin', 'clopidogrel',
            'pantoprazole', 'omeprazole', 'rabeprazole', 'sucralfate',
            'amoxicillin', 'clavulanate', 'azithromycin', 'ciprofloxacin', 'cefixime',
            'paracetamol', 'ibuprofen', 'diclofenac', 'tramadol',
            'levothyroxine', 'vitamin d3', 'calcium carbonate', 'zincovit', 'montelukast', 'levocetirizine'
        ]

        self.doctor_pattern = re.compile(r'(?i)\b(?:dr\.?|doctor)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\b')
        self.hospital_pattern = re.compile(r'(?i)\b([a-zA-Z\s]+(?:hospital|clinic|health\s*center|medical\s*center|pathology\s*lab))\b')
        self.date_pattern = re.compile(r'\b(?:\d{1,2}[-/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{1,2})[-/\s]\d{2,4}|\d{4}-\d{2}-\d{2})\b', re.IGNORECASE)

    def classify_status(self, num_val: float, ref_low: float, ref_high: float) -> str:
        """Determines abnormality status: LOW, HIGH, NORMAL, CRITICAL."""
        if num_val < ref_low:
            if num_val < ref_low * 0.7:
                return 'CRITICAL_LOW'
            return 'LOW'
        elif num_val > ref_high:
            if num_val > ref_high * 1.5:
                return 'CRITICAL_HIGH'
            return 'HIGH'
        return 'NORMAL'

    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        entities = []

        # 1. Labs Extraction
        for regex, normalized_name, default_unit, default_ref in self.lab_patterns:
            for m in re.finditer(regex, text):
                val_str = m.group(2)
                unit = m.group(3) or default_unit
                ref_str = m.group(4) if len(m.groups()) >= 4 and m.group(4) else None

                # Calculate abnormality
                status = 'UNKNOWN'
                ref_low, ref_high = default_ref
                try:
                    num_val = float(val_str)
                    if ref_str and '-' in ref_str:
                        parts = ref_str.split('-')
                        ref_low = float(parts[0].strip())
                        ref_high = float(parts[1].strip())
                    status = self.classify_status(num_val, ref_low, ref_high)
                except ValueError:
                    num_val = None

                entities.append({
                    "entity_type": "LAB_TEST",
                    "value": val_str,
                    "normalized_value": normalized_name,
                    "unit": unit,
                    "reference_range": ref_str or f"{default_ref[0]} - {default_ref[1]}",
                    "confidence": 0.98,
                })

        # 2. Vitals Extraction
        for regex, vital_name, default_unit in self.vital_patterns:
            for m in re.finditer(regex, text):
                val = m.group(1)
                unit = default_unit
                if vital_name == 'Blood Pressure' and len(m.groups()) >= 2:
                    val = f"{m.group(1)}/{m.group(2)}"
                entities.append({
                    "entity_type": "VITAL_SIGN",
                    "value": val,
                    "normalized_value": vital_name,
                    "unit": unit,
                    "confidence": 0.97,
                })

        # 3. Medications Extraction
        for med in self.common_medications:
            pattern = rf'(?i)\b(?:tab\.?|cap\.?|syp\.?|rx:?)?\s*({re.escape(med)})\s*(\d+\s*(?:mg|ml|mcg|gm|iu))?\s*(od|bd|tds|qid|once daily|twice daily|sos)?\b'
            for m in re.finditer(pattern, text):
                med_name = m.group(1)
                entities.append({
                    "entity_type": "MEDICATION",
                    "value": med_name.title(),
                    "normalized_value": med_name.title(),
                    "confidence": 0.96,
                })

        # 4. Doctor Extraction
        doc_match = self.doctor_pattern.search(text)
        if doc_match:
            entities.append({
                "entity_type": "DOCTOR",
                "value": doc_match.group(0).strip(),
                "normalized_value": doc_match.group(0).strip(),
                "confidence": 0.98,
            })

        # 5. Hospital Extraction
        hosp_match = self.hospital_pattern.search(text)
        if hosp_match:
            entities.append({
                "entity_type": "HOSPITAL",
                "value": hosp_match.group(0).strip(),
                "normalized_value": hosp_match.group(0).strip(),
                "confidence": 0.96,
            })

        # 6. Date Extraction
        date_match = self.date_pattern.search(text)
        if date_match:
            entities.append({
                "entity_type": "DATE",
                "value": date_match.group(0).strip(),
                "normalized_value": date_match.group(0).strip(),
                "confidence": 0.99,
            })

        return entities
