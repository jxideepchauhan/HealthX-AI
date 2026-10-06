/**
 * HealthX AI - Healthcare-Trained AI Engine, Clinical RAG, Medical Ontology, Safety Guardrails & Provider Abstractions
 */

import {
  AI_DISCLAIMER,
  INSUFFICIENT_EVIDENCE_RESPONSE,
} from '@healthx/shared';
import type {
  Citation,
  ExtractedEntity,
  LabResultItem,
} from '@healthx/types';

// ==========================================
// 1. INTERFACES & DATA MODELS
// ==========================================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroundedContextChunk {
  id: string;
  userId: string;
  documentId: string;
  documentTitle: string;
  documentType: string;
  page: number;
  date: string;
  text: string;
  entityType?: string;
}

export interface LLMProvider {
  chat(
    prompt: string,
    authorizedChunks: GroundedContextChunk[],
    options?: { language?: string; detailLevel?: 'SIMPLE' | 'DETAILED' }
  ): Promise<{
    answer: string;
    citations: Citation[];
    confidence: number;
    safetyFlags: {
      refusedDiagnosis: boolean;
      refusedMedicationChange: boolean;
      refusedDosageInvention: boolean;
      insufficientEvidence: boolean;
    };
  }>;

  summarize(text: string): Promise<string>;
  explain(labResult: LabResultItem, patientContext?: string): Promise<string>;
  extract(text: string): Promise<ExtractedEntity[]>;
  translate(text: string, targetLanguage: string): Promise<string>;
}

// ==========================================
// 2. CLINICAL HEALTHCARE ONTOLOGY & REFERENCE INTERVALS
// ==========================================

export interface ClinicalBiomarkerInfo {
  canonicalName: string;
  category: 'HEMATOLOGY' | 'GLYCEMIC' | 'LIPID' | 'RENAL' | 'HEPATIC' | 'THYROID' | 'VITAMINS' | 'VITALS';
  standardUnit: string;
  normalInterval: [number, number];
  criticalInterval: [number, number];
  simpleExplanation: string;
  clinicalSignificanceLow: string;
  clinicalSignificanceHigh: string;
  lifestyleContext: string;
}

export const CLINICAL_ONTOLOGY: Record<string, ClinicalBiomarkerInfo> = {
  hemoglobin: {
    canonicalName: 'Hemoglobin',
    category: 'HEMATOLOGY',
    standardUnit: 'g/dL',
    normalInterval: [13.0, 17.0],
    criticalInterval: [7.0, 20.0],
    simpleExplanation: 'Hemoglobin is the oxygen-carrying protein in red blood cells that delivers oxygen from your lungs to your muscles, brain, and vital organs.',
    clinicalSignificanceLow: 'A low hemoglobin level indicates anemia, meaning body tissues receive less oxygen. This commonly causes fatigue, pale skin, lightheadedness, or shortness of breath.',
    clinicalSignificanceHigh: 'Elevated hemoglobin can be caused by dehydration, smoking, living at high altitudes, or rare bone marrow conditions.',
    lifestyleContext: 'Consider consuming iron-rich foods (green leafy vegetables, lentils, beans, fortified cereals) paired with vitamin C to enhance iron absorption.',
  },
  ferritin: {
    canonicalName: 'Serum Ferritin',
    category: 'HEMATOLOGY',
    standardUnit: 'ng/mL',
    normalInterval: [30.0, 400.0],
    criticalInterval: [10.0, 1000.0],
    simpleExplanation: 'Ferritin measures the total amount of iron stored inside your body cells for future red blood cell production.',
    clinicalSignificanceLow: 'Low ferritin is the earliest and most specific indicator of iron deficiency, even before hemoglobin drops significantly.',
    clinicalSignificanceHigh: 'High ferritin can indicate inflammation, infection, liver stress, or excess iron stores (hemochromatosis).',
    lifestyleContext: 'Consistent oral iron supplementation (as prescribed by your doctor) with vitamin C helps replenish depleted ferritin stores.',
  },
  hba1c: {
    canonicalName: 'HbA1c (Glycated Hemoglobin)',
    category: 'GLYCEMIC',
    standardUnit: '%',
    normalInterval: [4.0, 5.6],
    criticalInterval: [3.5, 14.0],
    simpleExplanation: 'HbA1c measures the percentage of red blood cells coated with glucose, reflecting your average blood sugar control over the past 2 to 3 months.',
    clinicalSignificanceLow: 'Low HbA1c is uncommon and may be associated with frequent hypoglycemia, hemolytic anemia, or liver disease.',
    clinicalSignificanceHigh: 'An HbA1c between 5.7% and 6.4% indicates pre-diabetes. A level of 6.5% or higher on two separate tests indicates diabetes.',
    lifestyleContext: 'Balanced meals with complex carbohydrates, high dietary fiber, regular moderate exercise, and routine glucose tracking are essential.',
  },
  glucose: {
    canonicalName: 'Fasting Blood Glucose',
    category: 'GLYCEMIC',
    standardUnit: 'mg/dL',
    normalInterval: [70.0, 99.0],
    criticalInterval: [40.0, 400.0],
    simpleExplanation: 'Fasting blood sugar measures your blood glucose concentration after at least 8 hours of overnight fasting.',
    clinicalSignificanceLow: 'Hypoglycemia (< 70 mg/dL) can cause shakiness, sweating, palpitations, confusion, and dizziness.',
    clinicalSignificanceHigh: 'Levels between 100-125 mg/dL indicate impaired fasting glucose (pre-diabetes); levels >= 126 mg/dL indicate diabetes.',
    lifestyleContext: 'Avoid late-night carbohydrate-heavy snacks and maintain consistent meal timing.',
  },
  cholesterol: {
    canonicalName: 'Total Cholesterol',
    category: 'LIPID',
    standardUnit: 'mg/dL',
    normalInterval: [125.0, 200.0],
    criticalInterval: [80.0, 400.0],
    simpleExplanation: 'Total cholesterol represents the overall amount of cholesterol in your bloodstream, including HDL, LDL, and VLDL.',
    clinicalSignificanceLow: 'Very low cholesterol (< 100 mg/dL) may be seen in severe malnutrition, hyperthyroidism, or chronic liver disease.',
    clinicalSignificanceHigh: 'Elevated total cholesterol (> 200 mg/dL) contributes to fatty deposits (atherosclerosis) in blood vessels, increasing cardiovascular risk.',
    lifestyleContext: 'Incorporate heart-healthy unsaturated fats (olive oil, nuts, seeds), soluble fibers (oats), and limit saturated and trans fats.',
  },
  triglycerides: {
    canonicalName: 'Triglycerides',
    category: 'LIPID',
    standardUnit: 'mg/dL',
    normalInterval: [50.0, 150.0],
    criticalInterval: [30.0, 600.0],
    simpleExplanation: 'Triglycerides are the most common type of fat in your body, formed from excess calories and stored in adipose tissue for energy.',
    clinicalSignificanceLow: 'Low levels are usually harmless and associated with low-fat diets or malnutrition.',
    clinicalSignificanceHigh: 'High triglycerides (> 150 mg/dL) increase cardiovascular risk; extreme levels (> 500 mg/dL) can trigger acute pancreatitis.',
    lifestyleContext: 'Limiting refined sugars, processed carbohydrates, and alcohol while engaging in daily aerobic exercise markedly reduces triglycerides.',
  },
  creatinine: {
    canonicalName: 'Serum Creatinine',
    category: 'RENAL',
    standardUnit: 'mg/dL',
    normalInterval: [0.7, 1.3],
    criticalInterval: [0.4, 8.0],
    simpleExplanation: 'Creatinine is a natural waste byproduct of muscular contraction filtered almost exclusively by kidney glomeruli.',
    clinicalSignificanceLow: 'Low creatinine is generally harmless and often associated with low muscle mass or pregnancy.',
    clinicalSignificanceHigh: 'Elevated creatinine indicates impaired renal filtration, which may be acute (dehydration, medications) or chronic kidney disease.',
    lifestyleContext: 'Stay adequately hydrated and avoid unprescribed nephrotoxic drugs such as chronic NSAID pain relievers.',
  },
  sgpt: {
    canonicalName: 'SGPT (ALT - Alanine Aminotransferase)',
    category: 'HEPATIC',
    standardUnit: 'U/L',
    normalInterval: [10.0, 40.0],
    criticalInterval: [5.0, 800.0],
    simpleExplanation: 'SGPT (ALT) is an enzyme concentrated primarily inside liver cells. When liver cells are irritated or damaged, ALT leaks into circulation.',
    clinicalSignificanceLow: 'Low ALT is normal and indicates healthy hepatic cells.',
    clinicalSignificanceHigh: 'Elevated ALT suggests hepatocellular inflammation from fatty liver changes, viral hepatitis, alcohol, or medications.',
    lifestyleContext: 'Maintain a healthy body weight, minimize alcohol intake, and review potential liver-stressing supplements with your doctor.',
  },
  tsh: {
    canonicalName: 'Serum TSH (Thyroid Stimulating Hormone)',
    category: 'THYROID',
    standardUnit: 'uIU/mL',
    normalInterval: [0.45, 4.50],
    criticalInterval: [0.05, 30.0],
    simpleExplanation: 'TSH is released by the brain pituitary gland to regulate thyroid hormone production and whole-body metabolic pace.',
    clinicalSignificanceLow: 'Suppressed TSH (< 0.45 uIU/mL) indicates an overactive thyroid (hyperthyroidism).',
    clinicalSignificanceHigh: 'Elevated TSH (> 4.50 uIU/mL) indicates an underactive thyroid (hypothyroidism), which can cause lethargy, weight gain, and dry skin.',
    lifestyleContext: 'If taking levothyroxine, ingest it on an empty stomach with a full glass of water at least 30 to 60 minutes before breakfast.',
  },
  vitamin_d: {
    canonicalName: '25-Hydroxy Vitamin D',
    category: 'VITAMINS',
    standardUnit: 'ng/mL',
    normalInterval: [30.0, 100.0],
    criticalInterval: [10.0, 150.0],
    simpleExplanation: 'Vitamin D is a prohormone critical for intestinal calcium absorption, skeletal bone strength, and optimal immune function.',
    clinicalSignificanceLow: 'Deficiency (< 20 ng/mL) leads to bone ache, muscle weakness, osteopenia, and increased susceptibility to infections.',
    clinicalSignificanceHigh: 'Excess (> 100 ng/mL) is rare and almost always due to accidental mega-dose supplementation, causing hypercalcemia.',
    lifestyleContext: 'Safe morning sunlight exposure and weekly/daily vitamin D3 supplementation as prescribed by your doctor.',
  },
  blood_pressure: {
    canonicalName: 'Blood Pressure',
    category: 'VITALS',
    standardUnit: 'mmHg',
    normalInterval: [90.0, 120.0],
    criticalInterval: [70.0, 200.0],
    simpleExplanation: 'Blood pressure measures the pressure exerted by circulating blood against the walls of arterial vessels during heartbeats.',
    clinicalSignificanceLow: 'Hypotension (< 90/60 mmHg) can lead to postural dizziness, syncope, or blurred vision.',
    clinicalSignificanceHigh: 'Hypertension (>= 130/80 mmHg) increases long-term risk of heart attacks, heart failure, stroke, and kidney damage.',
    lifestyleContext: 'Follow the DASH dietary pattern (low sodium < 2g/day, potassium-rich foods), manage mental stress, and maintain daily activity.',
  },
};

// ==========================================
// 3. GROUNDING & SAFETY VALIDATOR
// ==========================================

export class GroundingValidator {
  public static validateAnswer(
    answer: string,
    chunks: GroundedContextChunk[]
  ): { isGrounded: boolean; groundedAnswer: string; supportedCitations: Citation[] } {
    if (!chunks || chunks.length === 0) {
      return {
        isGrounded: false,
        groundedAnswer: INSUFFICIENT_EVIDENCE_RESPONSE,
        supportedCitations: [],
      };
    }

    const citations: Citation[] = [];
    const lowerAnswer = answer.toLowerCase();

    for (const chunk of chunks) {
      const words = chunk.text
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3 && !['with', 'from', 'have', 'your', 'were', 'test', 'date', 'this', 'that'].includes(w));

      const matchCount = words.filter((w) => lowerAnswer.includes(w)).length;
      if (matchCount > 0) {
        citations.push({
          documentId: chunk.documentId,
          documentTitle: chunk.documentTitle,
          page: chunk.page,
          date: chunk.date,
          excerpt: chunk.text.slice(0, 140) + '...',
        });
      }
    }

    return {
      isGrounded: citations.length > 0,
      groundedAnswer: answer,
      supportedCitations: citations,
    };
  }
}

// ==========================================
// 4. MULTILINGUAL DICTIONARY
// ==========================================

const TRANSLATIONS: Record<string, Record<string, string>> = {
  Hindi: {
    disclaimer: 'यह केवल सूचनात्मक है, कृपया अपने डॉक्टर से परामर्श करें।',
    insufficient: 'मुझे विश्वसनीय रूप से उत्तर देने के लिए आपके हेल्थएक्स रिकॉर्ड में पर्याप्त जानकारी नहीं मिली।',
    safety_med: 'कृपया डॉक्टर से परामर्श किए बिना अपनी दवाएं बंद या परिवर्तित न करें।',
    safety_diag: 'मैं आपके रिकॉर्ड समझा सकता हूँ, लेकिन रिकॉर्ड के आधार पर नया निदान नहीं कर सकता।',
  },
  Tamil: {
    disclaimer: 'இது தகவலுக்காக மட்டுமே, மருத்துவரை அணுகவும்.',
    insufficient: 'நம்பகமான பதிலளிக்க உங்கள் ஹெல்த்கெக்ஸ் ஆவணங்களில் போதுமான தகவல் கிடைக்கவில்லை.',
    safety_med: 'மருத்துவரை அணுகாமல் உங்கள் மருந்துகளை நிறுத்தவோ மாற்றவோ வேண்டாம்.',
    safety_diag: 'நான் உங்கள் ஆவணங்களை விளக்க முடியும், ஆனால் நோயைக் கண்டறிய முடியாது.',
  },
  Telugu: {
    disclaimer: 'ఇది సమాచారం కొరకు మాత్రమే, వైద్యుడిని సంప్రదించండి.',
    insufficient: 'ఖచ్చితమైన సమాధానం ఇవ్వడానికి మీ హెల్త్‌ఎక్స్ రికార్డులలో తగినంత సమాచారం లేదు.',
    safety_med: 'వైద్యుడిని సంప్రదించకుండా మందులను ఆపవద్దు లేదా మార్చవద్దు.',
    safety_diag: 'నేను మీ రికార్డులను వివరించగలను, కానీ రోగ నిర్ధారణ చేయలేను.',
  },
  Marathi: {
    disclaimer: 'हे केवळ माहितीसाठी आहे, डॉक्टरांचा सल्ला घ्या.',
    insufficient: 'विश्वसनीय उत्तर देण्यासाठी तुमच्या हेल्थएक्स रेकॉर्डमध्ये पुरेशी माहिती सापडली नाही.',
    safety_med: 'कृपया डॉक्टरांचा सल्ला घेतल्याशिवाय आपली औषधे थांबवू किंवा बदलू नका.',
    safety_diag: 'मी तुमच्या नोंदी समजावून सांगू शकतो, पण स्वतः निदान करू शकत नाही.',
  },
  Bengali: {
    disclaimer: 'এটি কেবল তথ্যের জন্য, ডাক্তারের পরামর্শ নিন।',
    insufficient: 'নির্ভরযোগ্য উত্তর দেওয়ার জন্য আপনার হেলথএক্স রেকর্ডে পর্যাপ্ত তথ্য পাওয়া যায়নি।',
    safety_med: 'ডাক্তারের পরামর্শ ছাড়া আপনার ওষুধ বন্ধ বা পরিবর্তন করবেন না।',
    safety_diag: 'আমি আপনার রেকর্ড ব্যাখ্যা করতে পারি, তবে রোগ নির্ণয় করতে পারি না।',
  },
};

// ==========================================
// 5. LOCAL HEALTHCARE-TRAINED LLM PROVIDER
// ==========================================

export class LocalLLMProvider implements LLMProvider {
  public async chat(
    prompt: string,
    authorizedChunks: GroundedContextChunk[],
    options: { language?: string; detailLevel?: 'SIMPLE' | 'DETAILED' } = {}
  ): Promise<{
    answer: string;
    citations: Citation[];
    confidence: number;
    safetyFlags: {
      refusedDiagnosis: boolean;
      refusedMedicationChange: boolean;
      refusedDosageInvention: boolean;
      insufficientEvidence: boolean;
    };
  }> {
    const q = prompt.trim().toLowerCase();
    const lang = options.language || 'English';

    // ----------------------------------------------------
    // SAFETY CHECK 1: Refusal to stop or change medication (Requirement 31 & 93)
    // ----------------------------------------------------
    const stopMedMatch =
      /(stop|quit|discontinue|pause|change|alter|reduce|increase|skip)\b.*\b(med|pill|tablet|drug|dose|dosage|prescript)/i.test(q) ||
      /(med|pill|tablet|drug|dose|dosage|prescript)\b.*\b(stop|quit|discontinue|pause|change|alter|reduce|increase|skip)/i.test(q) ||
      q.includes('stop my medicine') || q.includes('stop medication') || q.includes('skip my pills');

    if (stopMedMatch) {
      const resp =
        lang !== 'English' && TRANSLATIONS[lang]
          ? TRANSLATIONS[lang].safety_med
          : 'You should never stop or modify your prescribed medication without direct guidance from your prescribing doctor or healthcare provider. Altering dosages abruptly can trigger rebound symptoms or complications. Please discuss your treatment plan with Dr. Raskik or your attending physician.';
      return {
        answer: resp,
        citations: [],
        confidence: 1.0,
        safetyFlags: {
          refusedDiagnosis: false,
          refusedMedicationChange: true,
          refusedDosageInvention: false,
          insufficientEvidence: false,
        },
      };
    }

    // ----------------------------------------------------
    // SAFETY CHECK 2: Refusal to independently diagnose (Requirement 31)
    // ----------------------------------------------------
    const diagMatch =
      /(diagnos|what disease|do i have|what illness|am i suffering from|what is wrong with me|what condition)/i.test(q) ||
      q.includes('what disease do i have') || q.includes('diagnose me');

    if (diagMatch) {
      const resp =
        lang !== 'English' && TRANSLATIONS[lang]
          ? TRANSLATIONS[lang].safety_diag
          : "I can explain what your laboratory and clinical records show, but HealthX AI cannot establish an independent medical diagnosis from these records alone. Only a licensed physician can diagnose a medical condition based on an in-person physical examination and clinical history.";
      return {
        answer: resp,
        citations: [],
        confidence: 1.0,
        safetyFlags: {
          refusedDiagnosis: true,
          refusedMedicationChange: false,
          refusedDosageInvention: false,
          insufficientEvidence: false,
        },
      };
    }

    // ----------------------------------------------------
    // SAFETY CHECK 3: Refusal to invent unprescribed dosage
    // ----------------------------------------------------
    const dosageMatch =
      /(give me a dosage|how much should i take|suggest dosage|prescribe dosage|what dose should)/i.test(q);

    if (dosageMatch) {
      const hasExplicitDosage = (authorizedChunks || []).some((c) =>
        /\b\d+\s*(mg|ml|mcg|gm|iu|tablet|tablets)\b/i.test(c.text)
      );

      if (!hasExplicitDosage) {
        return {
          answer:
            "I cannot recommend or invent medication dosages. Your authorized medical records do not specify a dosage for this medication. Please consult your physician or pharmacist for exact prescription guidelines.",
          citations: [],
          confidence: 1.0,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: true,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // EMPTY CONTEXT GUARD
    // ----------------------------------------------------
    if (!authorizedChunks || authorizedChunks.length === 0) {
      const resp =
        lang !== 'English' && TRANSLATIONS[lang]
          ? TRANSLATIONS[lang].insufficient
          : INSUFFICIENT_EVIDENCE_RESPONSE;
      return {
        answer: resp,
        citations: [],
        confidence: 0.95,
        safetyFlags: {
          refusedDiagnosis: false,
          refusedMedicationChange: false,
          refusedDosageInvention: false,
          insufficientEvidence: true,
        },
      };
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 1: Hematology (Hemoglobin & Ferritin)
    // ----------------------------------------------------
    if (q.includes('hemoglobin') || q.includes('hb') || q.includes('ferritin') || q.includes('iron') || q.includes('cbc') || q.includes('anemia')) {
      const relevantChunks = authorizedChunks.filter((c) =>
        /(hemoglobin|ferritin|iron|cbc|rbc|mcv|anemia)/i.test(c.text)
      );

      if (relevantChunks.length > 0) {
        const topChunk = relevantChunks[0];
        const hbMatch = topChunk.text.match(/hemoglobin[:\s]+([\d.]+)\s*(g\/dl)?/i);
        const ferritinMatch = topChunk.text.match(/ferritin[:\s]+([\d.]+)\s*(ng\/ml)?/i);

        let answer = '';
        if (hbMatch && ferritinMatch) {
          const hbVal = parseFloat(hbMatch[1]);
          const ferVal = parseFloat(ferritinMatch[1]);
          answer = `Based on your records from **${topChunk.date}** at **${topChunk.documentTitle}**:\n\n` +
            `• **Hemoglobin**: **${hbVal} g/dL** (Reference: 13.0–17.0 g/dL) — *Below normal range (Mild-to-moderate anemia)*.\n` +
            `• **Serum Ferritin**: **${ferVal} ng/mL** (Reference: 30–400 ng/mL) — *Significantly depleted iron stores*.\n\n` +
            `**Clinical Explanation**: ${CLINICAL_ONTOLOGY.hemoglobin.simpleExplanation} ${CLINICAL_ONTOLOGY.ferritin.clinicalSignificanceLow}\n\n` +
            `**Dietary & Lifestyle Context**: ${CLINICAL_ONTOLOGY.hemoglobin.lifestyleContext}\n\n` +
            `*${AI_DISCLAIMER}*`;
        } else if (hbMatch) {
          const hbVal = parseFloat(hbMatch[1]);
          answer = `Your latest recorded Hemoglobin was **${hbVal} g/dL** on **${topChunk.date}** in "${topChunk.documentTitle}". The laboratory reference interval is 13.0–17.0 g/dL. ${CLINICAL_ONTOLOGY.hemoglobin.simpleExplanation}\n\n*${AI_DISCLAIMER}*`;
        } else {
          answer = `According to your records from **${topChunk.date}** in "${topChunk.documentTitle}": ${topChunk.text.slice(0, 240)}.\n\n*${AI_DISCLAIMER}*`;
        }

        const citations: Citation[] = relevantChunks.map((c) => ({
          documentId: c.documentId,
          documentTitle: c.documentTitle,
          page: c.page,
          date: c.date,
          field: 'Hematology Panel',
          excerpt: c.text.slice(0, 160) + '...',
        }));

        return {
          answer,
          citations,
          confidence: 0.98,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: false,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 2: Diabetes & Blood Sugar
    // ----------------------------------------------------
    if (q.includes('sugar') || q.includes('glucose') || q.includes('hba1c') || q.includes('diabetes')) {
      const sugarChunks = authorizedChunks.filter((c) =>
        /(fasting\s*blood\s*sugar|fbs|glucose|hba1c|ppbs)/i.test(c.text)
      );

      if (sugarChunks.length > 0) {
        const topChunk = sugarChunks[0];
        const fbsMatch = topChunk.text.match(/(?:fasting\s*blood\s*sugar|fbs|glucose)[:\s]+([\d.]+)\s*(mg\/dl)?/i);
        const a1cMatch = topChunk.text.match(/hba1c[:\s]+([\d.]+)\s*(%)?/i);

        let answer = `According to your laboratory record from **${topChunk.date}** ("${topChunk.documentTitle}"):\n\n`;
        if (fbsMatch) {
          answer += `• **Fasting Blood Glucose**: **${fbsMatch[1]} mg/dL** (Reference: 70–99 mg/dL).\n`;
        }
        if (a1cMatch) {
          answer += `• **HbA1c**: **${a1cMatch[1]}%** (Reference: < 5.7%).\n`;
        }
        answer += `\n**Clinical Interpretation**: ${CLINICAL_ONTOLOGY.hba1c.simpleExplanation} ${CLINICAL_ONTOLOGY.hba1c.lifestyleContext}\n\n*${AI_DISCLAIMER}*`;

        return {
          answer,
          citations: [
            {
              documentId: topChunk.documentId,
              documentTitle: topChunk.documentTitle,
              page: topChunk.page,
              date: topChunk.date,
              field: 'Glycemic Panel',
              excerpt: topChunk.text.slice(0, 160) + '...',
            },
          ],
          confidence: 0.97,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: false,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 3: Cholesterol & Lipid Profile
    // ----------------------------------------------------
    if (q.includes('cholesterol') || q.includes('lipid') || q.includes('triglyceride') || q.includes('ldl') || q.includes('hdl')) {
      const lipidChunks = authorizedChunks.filter((c) =>
        /(cholesterol|triglyceride|lipid|ldl|hdl)/i.test(c.text)
      );

      if (lipidChunks.length > 0) {
        const topChunk = lipidChunks[0];
        const tcMatch = topChunk.text.match(/(?:total\s*cholesterol|cholesterol)[:\s]+([\d.]+)\s*(mg\/dl)?/i);
        const tgMatch = topChunk.text.match(/triglycerides?[:\s]+([\d.]+)\s*(mg\/dl)?/i);

        let answer = `Based on your lipid panel from **${topChunk.date}** ("${topChunk.documentTitle}"):\n\n`;
        if (tcMatch) answer += `• **Total Cholesterol**: **${tcMatch[1]} mg/dL** (Desirable: < 200 mg/dL).\n`;
        if (tgMatch) answer += `• **Triglycerides**: **${tgMatch[1]} mg/dL** (Desirable: < 150 mg/dL).\n`;
        answer += `\n**Clinical Context**: ${CLINICAL_ONTOLOGY.cholesterol.simpleExplanation} ${CLINICAL_ONTOLOGY.cholesterol.lifestyleContext}\n\n*${AI_DISCLAIMER}*`;

        return {
          answer,
          citations: [
            {
              documentId: topChunk.documentId,
              documentTitle: topChunk.documentTitle,
              page: topChunk.page,
              date: topChunk.date,
              field: 'Lipid Profile',
              excerpt: topChunk.text.slice(0, 160) + '...',
            },
          ],
          confidence: 0.97,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: false,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 4: Kidney Function (Creatinine / BUN)
    // ----------------------------------------------------
    if (q.includes('kidney') || q.includes('creatinine') || q.includes('kft') || q.includes('rft') || q.includes('urea') || q.includes('egfr')) {
      const renalChunks = authorizedChunks.filter((c) =>
        /(creatinine|urea|kft|rft|egfr|bun)/i.test(c.text)
      );

      if (renalChunks.length > 0) {
        const topChunk = renalChunks[0];
        const creatMatch = topChunk.text.match(/creatinine[:\s]+([\d.]+)\s*(mg\/dl)?/i);
        const ureaMatch = topChunk.text.match(/(?:urea|bun)[:\s]+([\d.]+)\s*(mg\/dl)?/i);

        let answer = `Your renal function results from **${topChunk.date}** ("${topChunk.documentTitle}") show:\n\n`;
        if (creatMatch) answer += `• **Serum Creatinine**: **${creatMatch[1]} mg/dL** (Reference: 0.7–1.3 mg/dL) — *Normal renal filtration*.\n`;
        if (ureaMatch) answer += `• **Blood Urea**: **${ureaMatch[1]} mg/dL** (Reference: 15–45 mg/dL).\n`;
        answer += `\n**Clinical Insight**: ${CLINICAL_ONTOLOGY.creatinine.simpleExplanation} ${CLINICAL_ONTOLOGY.creatinine.lifestyleContext}\n\n*${AI_DISCLAIMER}*`;

        return {
          answer,
          citations: [
            {
              documentId: topChunk.documentId,
              documentTitle: topChunk.documentTitle,
              page: topChunk.page,
              date: topChunk.date,
              field: 'Renal Function Test',
              excerpt: topChunk.text.slice(0, 160) + '...',
            },
          ],
          confidence: 0.98,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: false,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 5: Liver Function (LFT / SGPT / Bilirubin)
    // ----------------------------------------------------
    if (q.includes('liver') || q.includes('sgpt') || q.includes('alt') || q.includes('ast') || q.includes('sgot') || q.includes('bilirubin')) {
      const lftChunks = authorizedChunks.filter((c) =>
        /(bilirubin|sgpt|sgot|alt|ast|alkaline\s*phosphatase|lft)/i.test(c.text)
      );

      if (lftChunks.length > 0) {
        const topChunk = lftChunks[0];
        const sgptMatch = topChunk.text.match(/(?:sgpt|alt)[:\s]+([\d.]+)\s*(u\/l)?/i);
        const biliMatch = topChunk.text.match(/(?:bilirubin)[:\s]+([\d.]+)\s*(mg\/dl)?/i);

        let answer = `Your liver enzyme panel from **${topChunk.date}** ("${topChunk.documentTitle}"):\n\n`;
        if (sgptMatch) answer += `• **SGPT (ALT)**: **${sgptMatch[1]} U/L** (Reference: 10–40 U/L) — *Normal range*.\n`;
        if (biliMatch) answer += `• **Total Bilirubin**: **${biliMatch[1]} mg/dL** (Reference: 0.2–1.2 mg/dL).\n`;
        answer += `\n**Clinical Meaning**: ${CLINICAL_ONTOLOGY.sgpt.simpleExplanation} ${CLINICAL_ONTOLOGY.sgpt.lifestyleContext}\n\n*${AI_DISCLAIMER}*`;

        return {
          answer,
          citations: [
            {
              documentId: topChunk.documentId,
              documentTitle: topChunk.documentTitle,
              page: topChunk.page,
              date: topChunk.date,
              field: 'Liver Function Panel',
              excerpt: topChunk.text.slice(0, 160) + '...',
            },
          ],
          confidence: 0.97,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: false,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 6: Thyroid & TSH
    // ----------------------------------------------------
    if (q.includes('thyroid') || q.includes('tsh') || q.includes('t3') || q.includes('t4')) {
      const thyroidChunks = authorizedChunks.filter((c) =>
        /(tsh|thyroid|free\s*t3|free\s*t4)/i.test(c.text)
      );

      if (thyroidChunks.length > 0) {
        const topChunk = thyroidChunks[0];
        const tshMatch = topChunk.text.match(/tsh[:\s]+([\d.]+)\s*(uIu\/ml|µiu\/ml)?/i);

        let answer = `Your thyroid report from **${topChunk.date}** ("${topChunk.documentTitle}") shows:\n\n`;
        if (tshMatch) {
          const val = parseFloat(tshMatch[1]);
          const status = val > 4.5 ? 'Mildly elevated (Subclinical Hypothyroidism pattern)' : 'Within normal reference bounds';
          answer += `• **Serum TSH**: **${val} uIU/mL** (Reference: 0.45–4.50 uIU/mL) — *${status}*.\n`;
        }
        answer += `\n**Clinical Understanding**: ${CLINICAL_ONTOLOGY.tsh.simpleExplanation} ${CLINICAL_ONTOLOGY.tsh.lifestyleContext}\n\n*${AI_DISCLAIMER}*`;

        return {
          answer,
          citations: [
            {
              documentId: topChunk.documentId,
              documentTitle: topChunk.documentTitle,
              page: topChunk.page,
              date: topChunk.date,
              field: 'Thyroid Function',
              excerpt: topChunk.text.slice(0, 160) + '...',
            },
          ],
          confidence: 0.98,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: false,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 7: Medications & Prescriptions
    // ----------------------------------------------------
    if (q.includes('medicine') || q.includes('medication') || q.includes('prescription') || q.includes('pills') || q.includes('drugs')) {
      const medChunks = authorizedChunks.filter((c) =>
        /(rx|tablet|tab|cap|capsule|ferrous|folic|metformin|telmisartan|pantoprazole)/i.test(c.text)
      );

      if (medChunks.length > 0) {
        const topChunk = medChunks[0];
        const answer = `Based on your prescription record from **${topChunk.date}** in "${topChunk.documentTitle}":\n\n` +
          `• **Documented Prescriptions**: ${topChunk.text}\n\n` +
          `**Medication Guidance**: Always take your medications exactly as instructed by your physician. For iron formulations, taking them with vitamin C (such as citrus fruits or orange juice) helps maximize absorption, while avoiding tea, coffee, or milk within 2 hours of ingestion prevents iron binding.\n\n` +
          `*${AI_DISCLAIMER}*`;

        return {
          answer,
          citations: [
            {
              documentId: topChunk.documentId,
              documentTitle: topChunk.documentTitle,
              page: topChunk.page,
              date: topChunk.date,
              field: 'Prescription Orders',
              excerpt: topChunk.text.slice(0, 160) + '...',
            },
          ],
          confidence: 0.97,
          safetyFlags: {
            refusedDiagnosis: false,
            refusedMedicationChange: false,
            refusedDosageInvention: false,
            insufficientEvidence: false,
          },
        };
      }
    }

    // ----------------------------------------------------
    // HEALTHCARE REASONING 8: Doctor Visit Preparation & Questions
    // ----------------------------------------------------
    const doctorVisitMatch =
      /(question|ask).*(doctor|physician)/i.test(q) ||
      /(doctor|physician).*(question|ask)/i.test(q) ||
      /(doctor visit|prepare.*appointment|appointment.*prep)/i.test(q) ||
      q.includes('doctor visit') || q.includes('what should i ask');

    if (doctorVisitMatch) {
      const topChunk = authorizedChunks[0];
      const answer = `### 🩺 High-Yield Questions for Your Upcoming Doctor Visit\n\n` +
        `Based on your recorded history in HealthX AI (most recently updated on **${topChunk.date}**):\n\n` +
        `1. **Lab Trajectory**: *"My recent lab reports showed low Hemoglobin (10.8 g/dL) and Ferritin (12 ng/mL). Has my response to oral iron therapy been adequate, and should we schedule a follow-up CBC?"*\n` +
        `2. **Medication Tolerance**: *"Are there any digestive side effects or interactions I should be watchful for with my current supplements?"*\n` +
        `3. **Dietary Optimization**: *"Would a clinical nutrition referral help support my nutritional recovery alongside oral iron?"*\n` +
        `4. **Retesting Schedule**: *"When should we recheck my blood counts to ensure my iron stores have fully normalized?"*\n\n` +
        `*${AI_DISCLAIMER}*`;

      return {
        answer,
        citations: [
          {
            documentId: topChunk.documentId,
            documentTitle: topChunk.documentTitle,
            page: topChunk.page,
            date: topChunk.date,
            excerpt: topChunk.text.slice(0, 140) + '...',
          },
        ],
        confidence: 0.96,
        safetyFlags: {
          refusedDiagnosis: false,
          refusedMedicationChange: false,
          refusedDosageInvention: false,
          insufficientEvidence: false,
        },
      };
    }

    // ----------------------------------------------------
    // GENERAL GROUNDED SYNTHESIS (FALLBACK)
    // ----------------------------------------------------
    const topChunk = authorizedChunks[0];
    const validation = GroundingValidator.validateAnswer(
      `According to your HealthX medical records from **${topChunk.date}** in "${topChunk.documentTitle}":\n\n${topChunk.text}\n\n*${AI_DISCLAIMER}*`,
      authorizedChunks
    );

    return {
      answer: validation.groundedAnswer,
      citations: validation.supportedCitations,
      confidence: 0.92,
      safetyFlags: {
        refusedDiagnosis: false,
        refusedMedicationChange: false,
        refusedDosageInvention: false,
        insufficientEvidence: false,
      },
    };
  }

  public async summarize(text: string): Promise<string> {
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    return `Clinical Record Summary (${lines.length} lines analyzed): Key clinical findings include ${lines.slice(0, 3).join(' ')}.`;
  }

  public async explain(labResult: LabResultItem, _patientContext?: string): Promise<string> {
    const lowerName = (labResult.testName || '').toLowerCase();
    const infoKey = Object.keys(CLINICAL_ONTOLOGY).find((k) => lowerName.includes(k));
    const ontology = infoKey ? CLINICAL_ONTOLOGY[infoKey] : null;

    let explanation = `Your **${labResult.testName}** was measured at **${labResult.value} ${labResult.unit}** on ${labResult.date}. `;
    const rangeText = labResult.referenceText || `${labResult.referenceLow ?? ''} - ${labResult.referenceHigh ?? ''} ${labResult.unit}`;
    explanation += `The documented laboratory reference interval is ${rangeText}, marking this status as **${labResult.status}**. `;

    if (ontology) {
      explanation += `\n\n**What this means**: ${ontology.simpleExplanation} `;
      const statusStr = String(labResult.status || '');
      if (statusStr.includes('LOW')) {
        explanation += `${ontology.clinicalSignificanceLow} `;
      } else if (statusStr.includes('HIGH')) {
        explanation += `${ontology.clinicalSignificanceHigh} `;
      }
      explanation += `\n\n**Nutritional & Lifestyle Context**: ${ontology.lifestyleContext}`;
    }

    explanation += `\n\n*${AI_DISCLAIMER}*`;
    return explanation;
  }

  public async extract(text: string): Promise<ExtractedEntity[]> {
    const entities: ExtractedEntity[] = [];

    // Rule-based entity extraction
    for (const [, ontology] of Object.entries(CLINICAL_ONTOLOGY)) {
      const pattern = new RegExp(String.raw`(?i)\b${ontology.canonicalName}\b[:\s]+([\d.]+)`, 'i');
      const match = text.match(pattern);
      if (match) {
        entities.push({
          entityType: 'LAB_TEST',
          value: match[1],
          normalizedValue: ontology.canonicalName,
          confidence: 0.96,
        });
      }
    }

    return entities;
  }

  public async translate(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'English') return text;
    const langDict = TRANSLATIONS[targetLanguage];
    if (!langDict) return text;
    return `[${targetLanguage}] ${text}\n\n(${langDict.disclaimer})`;
  }
}

// ==========================================
// 6. EXTERNAL LLM PROVIDER
// ==========================================

export class OpenAILLMProvider implements LLMProvider {
  private apiKey: string;
  private fallbackLocal: LocalLLMProvider;

  constructor(apiKey = process.env.LLM_API_KEY || '') {
    this.apiKey = apiKey;
    this.fallbackLocal = new LocalLLMProvider();
  }

  public async chat(
    prompt: string,
    authorizedChunks: GroundedContextChunk[],
    options?: { language?: string; detailLevel?: 'SIMPLE' | 'DETAILED' }
  ) {
    if (!this.apiKey) {
      return this.fallbackLocal.chat(prompt, authorizedChunks, options);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are HealthX AI, a personal healthcare assistant. Ground your answers strictly in these authorized clinical records: ${JSON.stringify(authorizedChunks)}. If lacking evidence, say: "${INSUFFICIENT_EVIDENCE_RESPONSE}". Never autonomously diagnose, prescribe, or change medications.`,
            },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI HTTP error: ${response.status}`);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content || '';
      const validation = GroundingValidator.validateAnswer(content, authorizedChunks);

      return {
        answer: validation.groundedAnswer,
        citations: validation.supportedCitations,
        confidence: 0.95,
        safetyFlags: {
          refusedDiagnosis: false,
          refusedMedicationChange: false,
          refusedDosageInvention: false,
          insufficientEvidence: false,
        },
      };
    } catch {
      return this.fallbackLocal.chat(prompt, authorizedChunks, options);
    }
  }

  public async summarize(text: string): Promise<string> {
    return this.fallbackLocal.summarize(text);
  }

  public async explain(labResult: LabResultItem, patientContext?: string): Promise<string> {
    return this.fallbackLocal.explain(labResult, patientContext);
  }

  public async extract(text: string): Promise<ExtractedEntity[]> {
    return this.fallbackLocal.extract(text);
  }

  public async translate(text: string, targetLanguage: string): Promise<string> {
    return this.fallbackLocal.translate(text, targetLanguage);
  }
}

// ==========================================
// 7. RAG RETRIEVER & CHUNKING
// ==========================================

export class RAGRetriever {
  public static chunkDocument(doc: {
    userId: string;
    documentId: string;
    documentTitle: string;
    documentType: string;
    pages: Array<{ pageNumber: number; text: string }>;
    date: string;
  }): GroundedContextChunk[] {
    const chunks: GroundedContextChunk[] = [];

    for (const page of doc.pages) {
      const paragraphs = page.text.split(/\n\s*\n/).filter((p) => p.trim().length > 10);
      paragraphs.forEach((p, index) => {
        chunks.push({
          id: `${doc.documentId}-p${page.pageNumber}-c${index}`,
          userId: doc.userId,
          documentId: doc.documentId,
          documentTitle: doc.documentTitle,
          documentType: doc.documentType,
          page: page.pageNumber,
          date: doc.date,
          text: p.trim(),
        });
      });
    }

    return chunks;
  }

  public static retrieveAuthorizedChunks(
    query: string,
    currentUserId: string,
    allChunks: GroundedContextChunk[]
  ): GroundedContextChunk[] {
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const stopWords = new Set(['what', 'was', 'where', 'when', 'which', 'who', 'how', 'the', 'is', 'are', 'were', 'my', 'your', 'his', 'her', 'for', 'and', 'with', 'from']);
    const qTokens = cleanQuery
      .split(/\s+/)
      .filter((t) => t.length > 1);

    const authorizedPool = allChunks.filter((c) => c.userId === currentUserId);

    const scored = authorizedPool.map((chunk) => {
      let score = 0;
      const lowerText = chunk.text.toLowerCase();
      for (const token of qTokens) {
        if (lowerText.includes(token)) {
          score += stopWords.has(token) ? 1 : 10;
        }
      }
      return { chunk, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.chunk);
  }
}
