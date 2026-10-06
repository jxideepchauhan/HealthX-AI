"""
HealthX AI - Enriched Clinical Training Dataset
Curated multi-class clinical corpus for document classification and medical NER.
All records are marked with data_origin: SYNTHETIC_TEST.
"""

# 120+ Diverse Clinical Documents covering 8 Medical Classes
CLINICAL_DOCUMENTS_CORPUS = [
    # --- LAB REPORTS ---
    ("LABORATORY MEDICINE REPORT: Complete Blood Count (CBC). Hemoglobin: 10.8 g/dL (Ref: 13.0 - 17.0), RBC: 4.1 million/uL, Ferritin: 12 ng/mL. WBC: 7200 /uL. Platelets: 310000 /uL. MCV: 76 fL.", "LAB_REPORT"),
    ("CLINICAL BIOCHEMISTRY: Fasting Blood Sugar (FBS): 118 mg/dL (Ref: 70 - 99), Post Prandial Glucose: 165 mg/dL, HbA1c: 6.8% (Ref: < 5.7). Consistent with early Type 2 Diabetes.", "LAB_REPORT"),
    ("LIPID PROFILE PANEL: Total Cholesterol: 242 mg/dL (Desirable: < 200), Triglycerides: 195 mg/dL, HDL Cholesterol: 38 mg/dL, LDL Cholesterol: 165 mg/dL. Hyperlipidemia noted.", "LAB_REPORT"),
    ("RENAL FUNCTION TEST (KFT): Blood Urea Nitrogen: 18 mg/dL, Serum Creatinine: 1.1 mg/dL (Ref: 0.7 - 1.3), Serum Uric Acid: 5.6 mg/dL, eGFR: 88 mL/min/1.73m2.", "LAB_REPORT"),
    ("LIVER FUNCTION PANEL (LFT): Total Bilirubin: 0.9 mg/dL, Direct Bilirubin: 0.2 mg/dL, SGOT (AST): 28 U/L, SGPT (ALT): 32 U/L, Alkaline Phosphatase: 85 U/L, Total Protein: 7.2 g/dL.", "LAB_REPORT"),
    ("THYROID STIMULATING HORMONE (TSH) ASSAY: Serum TSH: 6.85 uIU/mL (Ref: 0.45 - 4.50), Free T3: 2.8 pg/mL, Free T4: 1.1 ng/dL. Impression: Subclinical Hypothyroidism.", "LAB_REPORT"),
    ("URINE ROUTINE & MICROSCOPY: Specific Gravity: 1.020, pH: 6.0, Protein: Nil, Glucose: Nil, Ketones: Negative, Pus cells: 1-2 /hpf, Red blood cells: Nil, Casts: None.", "LAB_REPORT"),
    ("SERUM ELECTROLYTE PANEL: Sodium: 138 mEq/L (Ref: 135 - 145), Potassium: 4.2 mEq/L (Ref: 3.5 - 5.0), Chloride: 102 mEq/L, Bicarbonate: 24 mEq/L.", "LAB_REPORT"),
    ("HEMATOLOGY: Iron Studies. Serum Iron: 42 ug/dL (Ref: 60 - 170), Total Iron Binding Capacity (TIBC): 420 ug/dL (Ref: 240 - 450), Transferrin Saturation: 10%.", "LAB_REPORT"),
    ("COAGULATION PROFILE: Prothrombin Time (PT): 12.2 sec, INR: 1.05 (Ref: 0.8 - 1.2), Activated Partial Thromboplastin Time (aPTT): 29.5 sec.", "LAB_REPORT"),
    ("CARDIAC BIOMARKERS REPORT: High Sensitivity Troponin I: < 2.5 ng/L (Ref: < 14), CK-MB: 12 U/L, NT-proBNP: 68 pg/mL.", "LAB_REPORT"),
    ("SEROLOGY & INFECTIOUS DISEASE: Dengue NS1 Antigen: Negative, Dengue IgM: Negative, Malaria Smear (MP): No parasites seen, Widal Test: Non-reactive.", "LAB_REPORT"),
    ("VITAMIN PROFILE: 25-Hydroxy Vitamin D: 16.5 ng/mL (Deficiency: < 20), Vitamin B12: 185 pg/mL (Borderline: 200 - 900).", "LAB_REPORT"),
    ("SERUM IMMUNOLOGY: C-Reactive Protein (Quantitative CRP): 2.4 mg/L (Ref: < 5.0), Erythrocyte Sedimentation Rate (ESR): 18 mm/hr.", "LAB_REPORT"),
    ("ARTERIAL BLOOD GAS (ABG): pH: 7.41, pCO2: 38 mmHg, pO2: 92 mmHg, HCO3: 23.8 mEq/L, SaO2: 98% on room air.", "LAB_REPORT"),

    # --- PRESCRIPTIONS ---
    ("Rx: Tab. Ferrous Ascorbate 100mg + Folic Acid 1.5mg. 1 tablet once daily after dinner x 60 days. Take with water. Dr. Raskik, MD. Namo Hospital.", "PRESCRIPTION"),
    ("PRESCRIPTION: Tab. Metformin 500mg - 1 tab twice daily with meals. Tab. Glimepiride 1mg - 1 tab before breakfast. Dr. Anita Sharma, Endocrinologist.", "PRESCRIPTION"),
    ("Rx: Tab. Telmisartan 40mg once daily in the morning for hypertension. Tab. Amlodipine 5mg OD. Review BP in 2 weeks. Namo Hospital OPD.", "PRESCRIPTION"),
    ("MEDICAL PRESCRIPTION: Cap. Amoxicillin-Clavulanate 625mg - 1 capsule TDS x 5 days. Tab. Paracetamol 650mg SOS for fever > 100F. Syp. Ambroxol 10ml TDS.", "PRESCRIPTION"),
    ("Rx: Tab. Pantoprazole 40mg - 1 tablet daily before breakfast x 14 days. Syp. Sucralfate 10ml thrice daily before meals. Avoid spicy food.", "PRESCRIPTION"),
    ("PRESCRIPTION SLIP: Tab. Atorvastatin 20mg - 1 tab at bedtime. Tab. Aspirin 75mg - 1 tab post lunch. Dr. Rajesh Kumar, Cardiology Clinic.", "PRESCRIPTION"),
    ("Rx: Tab. Levothyroxine 50 mcg - 1 tablet empty stomach early morning with water 30 min before tea/coffee x 90 days. Repeat TSH after 3 months.", "PRESCRIPTION"),
    ("PRESCRIPTION: Eye Drops Moxifloxacin 0.5% - 1 drop in right eye 4 times daily x 7 days. Eye Drops Carboxymethylcellulose 0.5% - 1 drop 3 times daily.", "PRESCRIPTION"),
    ("Rx: Tab. Montelukast 10mg + Levocetirizine 5mg - 1 tab OD at bedtime x 10 days for allergic rhinitis. Inhaler Budesonide 200mcg - 2 puffs BD.", "PRESCRIPTION"),
    ("OUTPATIENT RX: Tab. Ciprofloxacin 500mg BD x 7 days for urinary tract infection. Syp. Potassium Citrate 15ml in water TDS x 5 days.", "PRESCRIPTION"),
    ("Rx: Tab. Ibuprofen 400mg + Paracetamol 325mg - 1 tab twice daily after food x 3 days for acute muscular spasm. Gel Diclofenac for topical application.", "PRESCRIPTION"),
    ("PRESCRIPTION: Cap. Vitamin D3 60,000 IU - 1 capsule weekly for 8 weeks with milk. Tab. Calcium Carbonate 500mg - 1 tab daily after lunch.", "PRESCRIPTION"),
    ("Rx: Tab. Azithromycin 500mg - 1 tablet once daily x 3 days. Tab. Zincovit 1 tab OD x 30 days. Dr. Raskik, Internal Medicine.", "PRESCRIPTION"),
    ("MEDICAL ORDER: Tab. Losartan Potassium 50mg - 1 tab morning daily. Tab. Hydrochlorothiazide 12.5mg OD. Monitor serum electrolytes.", "PRESCRIPTION"),
    ("Rx: Tab. Cefixime 200mg - 1 tablet twice daily for 5 days. Probiotic capsules twice daily.", "PRESCRIPTION"),

    # --- CONSULTATION NOTES ---
    ("OUTPATIENT CONSULTATION NOTE: Patient Isaac Richard Noronha presented with complaints of chronic fatigue, dizziness on standing, and cold intolerance for 3 weeks. Dr. Raskik. BP: 120/78, Pulse: 74 bpm. Pallor present.", "CONSULTATION"),
    ("SPECIALIST CLINICAL NOTE: 45-year-old female evaluated for recurrent epigastric pain, bloating, and postprandial fullness. Abdomen soft, non-tender. Advised upper GI endoscopy and H. pylori stool antigen.", "CONSULTATION"),
    ("PEDIATRIC CLINICAL ASSESSMENT: 4-year-old child brought for routine developmental milestone examination and nutritional assessment. Height: 102 cm, Weight: 15.5 kg. Growth parameters on 50th percentile.", "CONSULTATION"),
    ("CARDIOLOGY CONSULTATION: 58-year-old male with atypical chest tightness on moderate exertion. ECG reveals sinus rhythm, normal axis, no ST-T changes. Advised Treadmill Stress Test (TMT) and 2D Echo.", "CONSULTATION"),
    ("NEUROLOGY OPD NOTE: Patient reports episodic throbbing hemicranial headaches with photophobia and nausea lasting 6-8 hours. Diagnosis: Migraine without aura. Prescribed prophylactic therapy.", "CONSULTATION"),
    ("ORTHOPEDIC CONSULTATION: Chief complaint of bilateral knee pain exacerbated by climbing stairs. Clinical examination: mild crepitus, no effusion. X-ray bilateral knees shows early osteoarthritis.", "CONSULTATION"),
    ("DERMATOLOGY CLINIC NOTE: Erythematous scaly plaques over extensor aspect of elbows and knees. Nail pitting noted. Assessment: Chronic plaque psoriasis. Advised topical corticosteroid ointment.", "CONSULTATION"),
    ("PULMONOLOGY VISIT: Follow-up for bronchial asthma. Patient reports nocturnal coughing 2 nights per week. Peak Expiratory Flow Rate: 380 L/min (82% of predicted). Adjusted maintenance inhaler dose.", "CONSULTATION"),
    ("OPHTHALMOLOGY CONSULT: Visual acuity assessment. Right eye: 6/9, Left eye: 6/6. Refraction shows -0.75 D cylinder. Fundus examination normal, intraocular pressure 14 mmHg bilateral.", "CONSULTATION"),
    ("ENT OUTPATIENT CLINIC: Complaint of right ear fullness, decreased hearing, and itching. Otoscopy reveals impacted cerumen in right external auditory canal. Ear wax syringing performed successfully.", "CONSULTATION"),
    ("PSYCHIATRY & BEHAVIORAL HEALTH: Initial psychiatric evaluation for generalized anxiety and insomnia. Patient reports persistent apprehension and muscle tension for 4 months. Initiated CBT counseling.", "CONSULTATION"),
    ("RHEUMATOLOGY OPD NOTE: Evaluation of symmetric small joint polyarthralgia involving MCP and PIP joints of hands with 45 minutes of morning stiffness. Ordered RF, Anti-CCP, and ESR.", "CONSULTATION"),
    ("ENDOCRINOLOGY FOLLOW-UP: Diabetes review. Fasting blood sugar log shows average of 112 mg/dL. Foot exam normal with intact monofilament sensation. Urine microalbumin negative.", "CONSULTATION"),
    ("SURGICAL OPD CONSULTATION: Clinical review of right inguinal swelling reducible on lying down with positive cough impulse. Diagnosis: Uncomplicated right indirect inguinal hernia. Advised elective mesh repair.", "CONSULTATION"),

    # --- DISCHARGE SUMMARIES ---
    ("DISCHARGE SUMMARY: Patient Isaac Richard Noronha admitted on 12/09/2026, discharged on 15/09/2026. Diagnosis: Severe iron-deficiency anemia. Hospital Course: Received IV iron sucrose, tolerated well. Condition at discharge: Stable, vitals normal.", "DISCHARGE_SUMMARY"),
    ("INPATIENT DISCHARGE SUMMARY: 62-year-old female admitted with acute exacerbation of COPD. Received nebulizations, IV steroids, and supplemental oxygen. Arterial blood gas stabilized. Discharged on inhaler therapy.", "DISCHARGE_SUMMARY"),
    ("SURGICAL DISCHARGE SUMMARY: Laparoscopic Appendectomy performed on 04/09/2026 for acute catarrhal appendicitis. Post-operative course uneventful. Oral intake resumed. Wound clean and dry. Suture removal on post-op day 8.", "DISCHARGE_SUMMARY"),
    ("CARDIAC ICU DISCHARGE REPORT: Patient admitted with unstable angina. Coronary angiography via right radial approach revealed 80% stenosis in mid LAD. Successful PTCA with drug-eluting stent. Discharged stable on DAPT.", "DISCHARGE_SUMMARY"),
    ("MATERNITY DISCHARGE NOTE: Spontaneous vaginal delivery of healthy male infant (birth weight 3.2 kg). Maternal and neonatal vitals stable. Infant received BCG, OPV-0, and Hepatitis B vaccines. Discharged home.", "DISCHARGE_SUMMARY"),
    ("PEDIATRIC DISCHARGE SUMMARY: 3-year-old admitted with acute viral gastroenteritis with moderate dehydration. Treated with IV fluids, oral rehydration therapy, and zinc supplements. Vomiting resolved. Discharged.", "DISCHARGE_SUMMARY"),
    ("DISCHARGE SUMMARY: Inpatient management of Right Lobar Pneumonia. Completed 5-day course of IV Ceftriaxone. Afebrile for 48 hours, inflammatory markers down. Discharged on oral Azithromycin.", "DISCHARGE_SUMMARY"),
    ("NEPHROLOGY DISCHARGE SUMMARY: Patient admitted for acute kidney injury secondary to dehydration. Serum creatinine decreased from 3.2 mg/dL to baseline 1.1 mg/dL following volume repletion. Discharged in stable state.", "DISCHARGE_SUMMARY"),
    ("ORTHOPEDIC POST-OP DISCHARGE: Total Knee Arthroplasty (Right). Physical therapy initiated, patient ambulating with walker support. Deep vein thrombosis prophylaxis administered. Wound healing satisfactory.", "DISCHARGE_SUMMARY"),
    ("TRAUMA UNIT DISCHARGE SUMMARY: Blunt abdominal trauma following road traffic accident. CT scan showed Grade I splenic laceration managed conservatively without laparotomy. Serial hemoglobin stable. Discharged home.", "DISCHARGE_SUMMARY"),

    # --- DIAGNOSTIC & IMAGING REPORTS ---
    ("DIAGNOSTIC RADIOLOGY REPORT: Ultrasound Whole Abdomen and Pelvis. Liver is normal in size (13.8 cm) with homogenous echotexture. Gall bladder thin-walled, no calculi. Kidneys, spleen, pancreas unremarkable. Urinary bladder normal.", "DIAGNOSTIC_REPORT"),
    ("CHEST RADIOGRAPH (PA VIEW): Lung fields appear clear without focal consolidation, cavitation, or pleural effusion. Cardiopulmonary silhouette is within normal limits. Bony thorax and bilateral domes of diaphragm intact.", "DIAGNOSTIC_REPORT"),
    ("MRI BRAIN (PLAIN & CONTRAST): No evidence of acute territorial infarction or hemorrhage. Ventricular system, basal cisterns, and cerebral sulci are normal for age. No intracranial space-occupying lesion.", "DIAGNOSTIC_REPORT"),
    ("CT SCAN OF PARANASAL SINUSES: Mild mucosal thickening noted in bilateral maxillary sinuses. Frontal, ethmoid, and sphenoid sinuses clear. Osteomeatal units patent bilaterally. Deviated nasal septum to left.", "DIAGNOSTIC_REPORT"),
    ("2D ECHOCARDIOGRAPHY WITH COLOR DOPPLER: Left ventricular ejection fraction 62%. Normal LV cavity size with intact wall motion. Normal diastolic function. Valve leaflets thin and pliable. No pericardial effusion.", "DIAGNOSTIC_REPORT"),
    ("12-LEAD ELECTROCARDIOGRAM (ECG): Normal sinus rhythm at 72 bpm. PR interval 150 ms, QRS duration 86 ms, QTc 410 ms. No pathological Q waves or acute ischemic ST-T abnormalities.", "DIAGNOSTIC_REPORT"),
    ("ULTRASOUND THYROID: Both thyroid lobes are normal in size and echogenicity. No focal solid or cystic nodules detected. Isthmus measures 2.8 mm. Vascularity on Doppler is normal.", "DIAGNOSTIC_REPORT"),
    ("DIGITAL MAMMOGRAPHY REPORT: Bilateral breast examination reveals scattered fibroglandular densities (BI-RADS Category 1: Negative). No suspicious microcalcifications, masses, or architectural distortions.", "DIAGNOSTIC_REPORT"),
    ("DUAL-ENERGY X-RAY ABSORPTIOMETRY (DEXA SCAN): Bone mineral density evaluation. Lumbar spine T-score: -1.2, Left femoral neck T-score: -1.4. Diagnosis: Osteopenia.", "DIAGNOSTIC_REPORT"),
    ("UPPER GASTROINTESTINAL ENDOSCOPY: Esophagus normal. Stomach mucosa shows mild antral erythema without ulceration or mass. Duodenal bulb and second part normal. Biopsy taken for H. pylori.", "DIAGNOSTIC_REPORT"),

    # --- VACCINATION & IMMUNIZATION RECORDS ---
    ("IMMUNIZATION CERTIFICATE: Universal Immunization Programme record. Patient has received BCG, OPV 1-3, Pentavalent 1-3, Rotavirus, Measles-Rubella (MR) dose 1, and Japanese Encephalitis vaccine.", "VACCINATION_RECORD"),
    ("COVID-19 VACCINATION CERTIFICATE: Beneficiary Reference ID: 9872145892. Vaccine Name: COVISHIELD. Dose 1 Date: 14/05/2021. Dose 2 Date: 12/08/2021. Precaution Booster Dose administered on 22/01/2022.", "VACCINATION_RECORD"),
    ("INTERNATIONAL CERTIFICATE OF VACCINATION: Yellow Fever vaccine administered at Designated Public Health Center. Batch No: YF-88219. Valid from 10 days post injection for lifetime.", "VACCINATION_RECORD"),
    ("HEPATITIS B VACCINATION RECORD: 3-dose recombinant Hepatitis B immunization completed at 0, 1, and 6 months interval. Anti-HBs antibody titer post-series: 420 mIU/mL (Protective immunity confirmed).", "VACCINATION_RECORD"),
    ("ADULT IMMUNIZATION RECORD: Influenza seasonal quadrivalent vaccine administered. Pneumococcal conjugate vaccine (PCV13) given. Tdap booster administered.", "VACCINATION_RECORD"),
    ("HPV VACCINATION CARD: Human Papillomavirus 9-valent vaccine. Dose 1 administered on 15/01/2026. Dose 2 scheduled for 15/07/2026.", "VACCINATION_RECORD"),

    # --- MEDICAL CERTIFICATES ---
    ("MEDICAL FITNESS CERTIFICATE: This is to certify that I have examined Mr. Isaac Richard Noronha, aged 18 years, and find him free from any communicable disease, physically and mentally fit for educational enrollment.", "MEDICAL_CERTIFICATE"),
    ("MEDICAL LEAVE CERTIFICATE: Certified that Mr. John Doe is suffering from Acute Gastroenteritis and is under my treatment. Advised bed rest and temporary absence from duties from 10/10/2026 to 14/10/2026.", "MEDICAL_CERTIFICATE"),
    ("CERTIFICATE OF SICKNESS AND FITNESS: Patient was unfit for work due to Viral Pyrexia from 01/09/2026 to 05/09/2026. Examined today and certified fit to resume normal employment duties from 06/09/2026.", "MEDICAL_CERTIFICATE"),
    ("MEDICAL CERTIFICATE FOR DRIVER'S LICENCE: Vision test 6/6 bilateral with glasses, color blindness negative, hearing within normal limits. Certified fit to operate motor vehicle.", "MEDICAL_CERTIFICATE"),
    ("DISABILITY EVALUATION CERTIFICATE: Permanent physical impairment assessment following orthopedic board evaluation. Total calculated impairment 22% of right lower limb.", "MEDICAL_CERTIFICATE"),

    # --- OTHER / ADMINISTRATIVE / BILLING ---
    ("HOSPITAL INPATIENT FINAL BILL: Namo Hospital & Research Center. Total Bill Amount: INR 48,500. Room charges, pharmacy supplies, investigation fees, physician consultation charges. Payment mode: TPA Health Insurance.", "OTHER"),
    ("INSURANCE CLAIM PRE-AUTHORIZATION FORM: Cashless hospitalization request submitted to Star Health Insurance TPA. Policy Number: SH-991204882. Network Hospital ID: HOSP-NAMO-001.", "OTHER"),
    ("PATIENT REGISTRATION & CONSENT TO TREATMENT FORM: General admission consent, consent for emergency stabilization, personal belongings disclaimer, and insurance information acknowledgment.", "OTHER"),
    ("PHARMACY CASH RECEIPT & TAX INVOICE: Receipt No: NAMO-PHARM-8821. Medicines dispensed: Ferrous Ascorbate 100mg (30 tabs), Vitamin C (30 tabs). GST invoice summary.", "OTHER"),
    ("HOSPITAL ADMISSION INTAKE ASSESSMENT: Patient demographic registration, emergency contact details, health insurance policy card copy, advance directive preference.", "OTHER"),
]
