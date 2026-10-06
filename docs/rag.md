# HealthX AI — Retrieval-Augmented Generation (RAG) Architecture (Sections 25, 26, 29, 30)

## RAG Flow
```
User Question
      |
Intent Classification & Language Normalization
      |
Authorization Filter (WHERE userId == current_user_id)
      |
Hybrid Keyword + Semantic Vector Retrieval
      |
Context Assembly (Preserving Document, Page, Date, and Field provenance)
      |
LLM Synthesis
      |
Grounding Validation (Checks factual medical-record claims against chunks)
      |
Response Formulation + Clickable Source Citations
```

## Security Multi-Tenancy Guarantee
A user **NEVER** retrieves another user's records. Retrieval queries strictly enforce:
```typescript
const authorizedPool = allChunks.filter((c) => c.userId === currentUserId);
```
Claims lacking supporting context chunks trigger the transparent fallback:
*"I couldn't find enough information in your HealthX records to answer that reliably."*
