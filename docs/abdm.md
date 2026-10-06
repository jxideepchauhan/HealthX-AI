# HealthX AI — ABDM / ABHA Gateway Connector (Sections 46, 47, 100)

## Architecture
HealthX AI integrates with the Ayushman Bharat Digital Mission (ABDM) ecosystem following official National Health Authority (NHA) specifications:
- **ABDM Milestone 1 (M1)**: ABHA identity creation and verification.
- **ABDM Milestone 2 (M2)**: HIP (Health Information Provider) & HIU (Health Information User) registration and care context linking.
- **ABDM Milestone 3 (M3)**: Consent manager integration and secure health data exchange via FHIR bundles.

## Provider Abstraction
- `MockABDMProvider`: Fully functional local connector for development, automated testing, and offline verification without external gateway dependencies.
- `OfficialABDMProvider`: Production connector that reads official sandbox/production endpoints from environment variables (`ABDM_BASE_URL`, `ABDM_CLIENT_ID`, `ABDM_CLIENT_SECRET`). Never guesses undocumented endpoints.
