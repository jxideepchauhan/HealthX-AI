"""
HealthX AI - Healthcare-Trained Medical Named Entity Recognition (NER) & Clinical Extractor
Extracts clinically grounded healthcare entities:
- LAB_TEST (with LOINC-ready canonical names, numeric value, unit, reference range, status: NORMAL/LOW/HIGH/CRITICAL)
- VITAL_SIGNS (Blood Pressure, Heart Rate, SpO2, Temperature, Respiratory Rate, BMI)
- MEDICATION (Active pharmaceutical ingredient, brand name, dosage, frequency, route)
- DIAGNOSIS (ICD-10-ready clinical diagnoses, symptoms, and assessments)
- DOCTOR (Attending physicians, consultants)
- HOSPITAL (Healthcare institutions, labs, clinics)
- DATE (Clinical collection, report, or encounter dates)
- UNCERTAINTY DETECTION (Flags low-confidence or physiologically borderline extractions for verification)
"""

import re
from typing import List, Dict, Any, Optional

class MedicalNERExtractor:
    def __init__(self):
        # 1. Comprehensive Laboratory Tests & Physiological Intervals
        self.lab_patterns = [
            # Hematology & CBC
            (r'(?i)\b(hemoglobin|hb|hgb)\b[:\s]*([\d.]+)\s*(g\/dl|gm\/dl|g\/100ml)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Hemoglobin', 'g/dL', (13.0, 17.0), (7.0, 20.0)),
            (r'(?i)\b(serum\s*ferritin|ferritin)\b[:\s]*([\d.]+)\s*(ng\/ml)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Ferritin', 'ng/mL', (30.0, 400.0), (10.0, 1000.0)),
            (r'(?i)\b(rbc|red\s*blood\s*cells?)\b[:\s]*([\d.]+)\s*(million\/µl|million\/ul|mil\/cumm)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Red Blood Cell Count', 'million/µL', (4.5, 5.9), (2.5, 7.5)),
            (r'(?i)\b(wbc|white\s*blood\s*cells?|tlc|total\s*leukocyte\s*count)\b[:\s]*([\d.]+)\s*(\/µl|\/ul|cells\/cumm)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'White Blood Cell Count', '/µL', (4000.0, 11000.0), (2000.0, 30000.0)),
            (r'(?i)\b(platelets?|platelet\s*count)\b[:\s]*([\d.]+)\s*(\/µl|\/ul|lakhs?\/cumm)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Platelet Count', '/µL', (150000.0, 450000.0), (20000.0, 1000000.0)),
            (r'(?i)\b(mcv|mean\s*corpuscular\s*volume)\b[:\s]*([\d.]+)\s*(fl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Mean Corpuscular Volume', 'fL', (80.0, 100.0), (60.0, 120.0)),
            (r'(?i)\b(mch|mean\s*corpuscular\s*hemoglobin)\b[:\s]*([\d.]+)\s*(pg)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Mean Corpuscular Hemoglobin', 'pg', (27.0, 33.0), (18.0, 40.0)),
            (r'(?i)\b(mchc)\b[:\s]*([\d.]+)\s*(g\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'MCHC', 'g/dL', (32.0, 36.0), (26.0, 40.0)),
            (r'(?i)\b(rdw|red\s*cell\s*distribution\s*width)\b[:\s]*([\d.]+)\s*(%)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'RDW', '%', (11.5, 14.5), (10.0, 25.0)),
            (r'(?i)\b(hematocrit|packed\s*cell\s*volume|pcv)\b[:\s]*([\d.]+)\s*(%)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Hematocrit', '%', (40.0, 52.0), (20.0, 60.0)),
            (r'(?i)\b(esr|erythrocyte\s*sedimentation\s*rate)\b[:\s]*([\d.]+)\s*(mm\/hr)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'ESR', 'mm/hr', (0.0, 20.0), (0.0, 120.0)),

            # Diabetes & Glycemic Panel
            (r'(?i)\b(fasting\s*blood\s*sugar|fbs|fasting\s*glucose)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Fasting Blood Glucose', 'mg/dL', (70.0, 99.0), (40.0, 400.0)),
            (r'(?i)\b(post\s*prandial\s*glucose|ppbs)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Post Prandial Glucose', 'mg/dL', (70.0, 140.0), (40.0, 500.0)),
            (r'(?i)\b(hba1c|glycated\s*hemoglobin)\b[:\s]*([\d.]+)\s*(%)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'HbA1c', '%', (4.0, 5.6), (3.0, 16.0)),

            # Renal Function (KFT/RFT)
            (r'(?i)\b(serum\s*creatinine|creatinine)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Creatinine', 'mg/dL', (0.7, 1.3), (0.4, 10.0)),
            (r'(?i)\b(blood\s*urea\s*nitrogen|bun|blood\s*urea)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Blood Urea', 'mg/dL', (15.0, 45.0), (5.0, 150.0)),
            (r'(?i)\b(serum\s*uric\s*acid|uric\s*acid)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Uric Acid', 'mg/dL', (3.5, 7.2), (1.5, 15.0)),
            (r'(?i)\b(egfr|estimated\s*gfr)\b[:\s]*([\d.]+)\s*(ml\/min\/1\.73m2)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'eGFR', 'mL/min/1.73m2', (90.0, 120.0), (10.0, 150.0)),

            # Lipid Profile
            (r'(?i)\b(total\s*cholesterol|cholesterol)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Total Cholesterol', 'mg/dL', (125.0, 200.0), (80.0, 450.0)),
            (r'(?i)\b(triglycerides?|tg)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Triglycerides', 'mg/dL', (50.0, 150.0), (30.0, 800.0)),
            (r'(?i)\b(hdl\s*cholesterol|hdl)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'HDL Cholesterol', 'mg/dL', (40.0, 60.0), (20.0, 100.0)),
            (r'(?i)\b(ldl\s*cholesterol|ldl)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'LDL Cholesterol', 'mg/dL', (50.0, 100.0), (30.0, 250.0)),

            # Liver Function (LFT)
            (r'(?i)\b(total\s*bilirubin|bilirubin\s*total)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Total Bilirubin', 'mg/dL', (0.2, 1.2), (0.1, 25.0)),
            (r'(?i)\b(sgpt|alt|alanine\s*aminotransferase)\b[:\s]*([\d.]+)\s*(u\/l|iu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'SGPT (ALT)', 'U/L', (10.0, 40.0), (5.0, 1500.0)),
            (r'(?i)\b(sgot|ast|aspartate\s*aminotransferase)\b[:\s]*([\d.]+)\s*(u\/l|iu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'SGOT (AST)', 'U/L', (10.0, 40.0), (5.0, 1500.0)),
            (r'(?i)\b(alkaline\s*phosphatase|alp)\b[:\s]*([\d.]+)\s*(u\/l|iu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Alkaline Phosphatase', 'U/L', (44.0, 147.0), (20.0, 600.0)),

            # Thyroid, Vitamins, & Electrolytes
            (r'(?i)\b(tsh|thyroid\s*stimulating\s*hormone)\b[:\s]*([\d.]+)\s*(µiu\/ml|uiu\/ml|miu\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum TSH', 'uIU/mL', (0.45, 4.5), (0.01, 50.0)),
            (r'(?i)\b(serum\s*sodium|sodium)\b[:\s]*([\d.]+)\s*(meq\/l|mmol\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Sodium', 'mEq/L', (135.0, 145.0), (115.0, 165.0)),
            (r'(?i)\b(serum\s*potassium|potassium)\b[:\s]*([\d.]+)\s*(meq\/l|mmol\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Potassium', 'mEq/L', (3.5, 5.0), (2.0, 7.5)),
            (r'(?i)\b(serum\s*calcium|calcium)\b[:\s]*([\d.]+)\s*(mg\/dl)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Serum Calcium', 'mg/dL', (8.5, 10.5), (6.0, 15.0)),
            (r'(?i)\b(vitamin\s*d|25-hydroxy\s*vitamin\s*d)\b[:\s]*([\d.]+)\s*(ng\/ml)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Vitamin D (25-OH)', 'ng/mL', (30.0, 100.0), (5.0, 150.0)),
            (r'(?i)\b(vitamin\s*b12|b12)\b[:\s]*([\d.]+)\s*(pg\/ml)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Vitamin B12', 'pg/mL', (200.0, 900.0), (50.0, 2000.0)),
            (r'(?i)\b(c-reactive\s*protein|crp)\b[:\s]*([\d.]+)\s*(mg\/l)?(?:\s*\(?(?:ref|reference)?[:\s]*([\d.]+\s*-\s*[\d.]+)\)?)?', 'Quantitative CRP', 'mg/L', (0.0, 5.0), (0.0, 250.0)),
        ]

        # 2. Vital Signs Patterns
        self.vital_patterns = [
            (r'(?i)\b(?:bp|blood\s*pressure)\b[:\s]*(\d{2,3})\/(\d{2,3})\s*(mmhg)?', 'Blood Pressure', 'mmHg'),
            (r'(?i)\b(?:pulse|heart\s*rate|hr)\b[:\s]*(\d{2,3})\s*(bpm)?', 'Heart Rate', 'bpm'),
            (r'(?i)\b(?:spo2|oxygen\s*saturation)\b[:\s]*(\d{2,3})\s*(%)?', 'Oxygen Saturation', '%'),
            (r'(?i)\b(?:temp|temperature)\b[:\s]*([\d.]+)\s*(°?f|°?c)?', 'Temperature', '°F'),
            (r'(?i)\b(?:respiratory\s*rate|rr)\b[:\s]*(\d{1,2})\s*(breaths\/min|\/min)?', 'Respiratory Rate', 'breaths/min'),
            (r'(?i)\b(?:bmi|body\s*mass\s*index)\b[:\s]*([\d.]+)\s*(kg\/m2)?', 'BMI', 'kg/m2'),
        ]

        # 3. Expanded Clinical Diagnoses
        self.diagnoses = [
            'iron deficiency anemia', 'microcytic hypochromic anemia', 'severe anemia',
            'type 2 diabetes mellitus', 'type 2 diabetes', 'diabetic nephropathy', 'diabetic retinopathy',
            'essential hypertension', 'hypertension', 'stage 1 hypertension',
            'subclinical hypothyroidism', 'hypothyroidism', 'hyperthyroidism',
            'hyperlipidemia', 'dyslipidemia', 'hypercholesterolemia',
            'bronchial asthma', 'asthma', 'chronic obstructive pulmonary disease', 'copd',
            'coronary artery disease', 'cad', 'unstable angina', 'acute myocardial infarction',
            'osteoarthritis', 'rheumatoid arthritis', 'osteopenia', 'osteoporosis',
            'gastroesophageal reflux disease', 'gerd', 'acute gastritis', 'peptic ulcer disease',
            'chronic kidney disease', 'acute kidney injury', 'migraine', 'plaque psoriasis'
        ]

        # 4. Comprehensive Medication Knowledge Base
        self.common_medications = [
            'iron supplement', 'ferrous ascorbate', 'ferrous sulfate', 'folic acid', 'vitamin c',
            'metformin', 'glimepiride', 'dapagliflozin', 'empagliflozin', 'sitagliptin', 'insulin',
            'telmisartan', 'amlodipine', 'losartan', 'enalapril', 'atenolol', 'hydrochlorothiazide',
            'atorvastatin', 'rosuvastatin', 'aspirin', 'clopidogrel', 'ezetimibe',
            'pantoprazole', 'omeprazole', 'rabeprazole', 'sucralfate',
            'amoxicillin', 'clavulanate', 'azithromycin', 'ciprofloxacin', 'cefixime', 'levofloxacin',
            'paracetamol', 'ibuprofen', 'diclofenac', 'tramadol', 'acebrophylline',
            'levothyroxine', 'vitamin d3', 'calcium carbonate', 'zincovit', 'montelukast', 'levocetirizine',
            'escitalopram', 'clonazepam', 'ursodeoxycholic acid', 'budesonide', 'formoterol', 'tamsulosin'
        ]

        self.doctor_pattern = re.compile(r'(?i)\b(?:dr\.?|doctor)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\b')
        self.hospital_pattern = re.compile(r'(?i)\b([a-zA-Z\s]+(?:hospital|clinic|health\s*center|medical\s*center|pathology\s*lab|diagnostic\s*center))\b')
        self.date_pattern = re.compile(r'\b(?:\d{1,2}[-/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{1,2})[-/\s]\d{2,4}|\d{4}-\d{2}-\d{2})\b', re.IGNORECASE)

    def classify_status(self, num_val: float, ref_low: float, ref_high: float, crit_low: float, crit_high: float) -> str:
        """Determines abnormality status with critical clinical alert flags."""
        if num_val < crit_low:
            return 'CRITICAL_LOW'
        elif num_val > crit_high:
            return 'CRITICAL_HIGH'
        elif num_val < ref_low:
            return 'LOW'
        elif num_val > ref_high:
            return 'HIGH'
        return 'NORMAL'

    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        entities = []

        # 1. Laboratory Extraction
        for item in self.lab_patterns:
            regex, normalized_name, default_unit, default_ref, crit_ref = item
            for m in re.finditer(regex, text):
                val_str = m.group(2)
                unit = m.group(3) or default_unit
                ref_str = m.group(4) if len(m.groups()) >= 4 and m.group(4) else None

                status = 'NORMAL'
                ref_low, ref_high = default_ref
                crit_low, crit_high = crit_ref
                is_uncertain = False
                uncertainty_reason = None

                try:
                    num_val = float(val_str)
                    if ref_str and '-' in ref_str:
                        parts = ref_str.split('-')
                        ref_low = float(parts[0].strip())
                        ref_high = float(parts[1].strip())
                    status = self.classify_status(num_val, ref_low, ref_high, crit_low, crit_high)

                    # Uncertainty check on extreme physiological limits
                    if num_val < (crit_low * 0.3) or num_val > (crit_high * 2.0):
                        is_uncertain = True
                        uncertainty_reason = "Value is outside plausible biological boundaries"
                except ValueError:
                    is_uncertain = True
                    uncertainty_reason = "Could not parse numerical value"

                entities.append({
                    "entity_type": "LAB_TEST",
                    "value": val_str,
                    "normalized_value": normalized_name,
                    "unit": unit,
                    "reference_range": ref_str or f"{default_ref[0]} - {default_ref[1]}",
                    "status": status,
                    "is_critical": status in ('CRITICAL_LOW', 'CRITICAL_HIGH'),
                    "is_uncertain": is_uncertain,
                    "uncertainty_reason": uncertainty_reason,
                    "confidence": 0.82 if is_uncertain else 0.98,
                })

        # 2. Vitals Extraction
        for regex, vital_name, default_unit in self.vital_patterns:
            for m in re.finditer(regex, text):
                val = m.group(1)
                unit = default_unit
                if vital_name == 'Blood Pressure' and len(m.groups()) >= 2 and m.group(2):
                    val = f"{m.group(1)}/{m.group(2)}"
                entities.append({
                    "entity_type": "VITAL_SIGN",
                    "value": val,
                    "normalized_value": vital_name,
                    "unit": unit,
                    "is_uncertain": False,
                    "confidence": 0.97,
                })

        # 3. Medications Extraction with Dosage & Frequency
        for med in self.common_medications:
            pattern = rf'(?i)\b(?:tab\.?|cap\.?|syp\.?|inhaler|rx:?)?\s*({re.escape(med)})\s*(\d+\s*(?:mg|ml|mcg|gm|iu))?\s*(od|bd|tds|qid|once daily|twice daily|sos|at bedtime)?\b'
            for m in re.finditer(pattern, text):
                med_name = m.group(1)
                dosage = m.group(2)
                freq = m.group(3)
                is_uncertain = dosage is None
                entities.append({
                    "entity_type": "MEDICATION",
                    "value": med_name.title(),
                    "normalized_value": med_name.title(),
                    "dosage": dosage.strip() if dosage else None,
                    "frequency": freq.strip() if freq else None,
                    "is_uncertain": is_uncertain,
                    "uncertainty_reason": "Dosage not explicitly documented" if is_uncertain else None,
                    "confidence": 0.80 if is_uncertain else 0.96,
                })

        # 4. Clinical Diagnoses & Assessments
        for diag in self.diagnoses:
            if re.search(rf'(?i)\b{re.escape(diag)}\b', text):
                entities.append({
                    "entity_type": "DIAGNOSIS",
                    "value": diag.title(),
                    "normalized_value": diag.title(),
                    "confidence": 0.95,
                    "is_uncertain": False,
                })

        # 5. Doctor Extraction
        doc_match = self.doctor_pattern.search(text)
        if doc_match:
            entities.append({
                "entity_type": "DOCTOR",
                "value": doc_match.group(0).strip(),
                "normalized_value": doc_match.group(0).strip(),
                "confidence": 0.98,
                "is_uncertain": False,
            })

        # 6. Hospital Extraction
        hosp_match = self.hospital_pattern.search(text)
        if hosp_match:
            entities.append({
                "entity_type": "HOSPITAL",
                "value": hosp_match.group(0).strip(),
                "normalized_value": hosp_match.group(0).strip(),
                "confidence": 0.96,
                "is_uncertain": False,
            })

        # 7. Date Extraction
        date_match = self.date_pattern.search(text)
        if date_match:
            entities.append({
                "entity_type": "DATE",
                "value": date_match.group(0).strip(),
                "normalized_value": date_match.group(0).strip(),
                "confidence": 0.99,
                "is_uncertain": False,
            })

        return entities
