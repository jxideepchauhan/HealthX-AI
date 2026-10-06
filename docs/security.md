# HealthX AI — Security, Privacy & Access Control (Sections 35, 36, 37, 38, 51)

## Security Pillars
1. **Multi-Tenancy Isolation**: Every patient-owned clinical record is strictly partitioned by `userId`.
2. **Consent-Based Access Control**: Doctors and hospitals can access clinical data only through active, unexpired, non-revoked consent grants. Revocation immediately terminates access.
3. **Passwordless OTP Architecture**: Cryptographic 6-digit OTP generation, HMAC-SHA256 hashing with per-session random salts, rate limiting, and brute-force lockouts.
4. **Append-Only Tamper-Evident Audit Logging**: Every `VIEW`, `CREATE`, `UPDATE`, `DELETE`, `SHARE`, and `REVOKE` action is hashed into an integrity chain (`previousHash` -> `hash`).
5. **Admin Privacy Boundary (Section 81)**: System administrators have infrastructure/metrics access but are prohibited from inspecting patient clinical records without explicit clinical consent.
6. **Input Sanitization & Secure Headers**: Helmet CSP headers, path traversal sanitization, and strict file MIME validation.
