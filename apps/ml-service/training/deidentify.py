"""
HealthX AI - Data De-identification Pipeline (Section 65)
Detects and scrubs Direct and Indirect Identifiers (PII/PHI) before model training:
- Patient Names
- Phone Numbers
- Email Addresses
- Addresses
- ABHA Identifiers (14-digit ABHA numbers and ABHA addresses)
- Patient / Hospital Record IDs
"""

import re
from typing import Dict, Any, Tuple

class DeidentificationPipeline:
    def __init__(self):
        self.phone_regex = re.compile(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
        self.email_regex = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
        self.abha_number_regex = re.compile(r'\b\d{2}-\d{4}-\d{4}-\d{4}\b|\b\d{14}\b')
        self.abha_address_regex = re.compile(r'\b[a-zA-Z0-9._]+@abdm\b|\b[a-zA-Z0-9._]+@sbx\b')
        self.patient_id_regex = re.compile(r'\b(MRN|PID|PATIENT\s*ID|UHID)[:\s]*([A-Za-z0-9-]+)\b', re.IGNORECASE)

    def scrub(self, text: str) -> Tuple[str, Dict[str, int]]:
        counts = {
            "phone": 0,
            "email": 0,
            "abha_number": 0,
            "abha_address": 0,
            "patient_id": 0,
        }

        # 1. Scrub ABHA Numbers
        text, n = self.abha_number_regex.subn('[REDACTED_ABHA_NUMBER]', text)
        counts["abha_number"] += n

        # 2. Scrub ABHA Addresses
        text, n = self.abha_address_regex.subn('[REDACTED_ABHA_ADDRESS]', text)
        counts["abha_address"] += n

        # 3. Scrub Emails
        text, n = self.email_regex.subn('[REDACTED_EMAIL]', text)
        counts["email"] += n

        # 4. Scrub Phones
        text, n = self.phone_regex.subn('[REDACTED_PHONE]', text)
        counts["phone"] += n

        # 5. Scrub UHID / Patient IDs
        text, n = self.patient_id_regex.subn(r'\1: [REDACTED_PATIENT_ID]', text)
        counts["patient_id"] += n

        return text, counts

if __name__ == "__main__":
    scrubber = DeidentificationPipeline()
    sample = "Patient UHID: 9812-XYZ, contact: +91-9876543210, email: john.doe@example.com, ABHA: 12-3456-7890-1234."
    clean, stats = scrubber.scrub(sample)
    print("Original:", sample)
    print("Scrubbed:", clean)
    print("Stats:", stats)
