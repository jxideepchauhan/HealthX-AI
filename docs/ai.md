# HealthX AI — Clinical AI, Safety & Guardrails (Section 2, 24, 28, 31)

## Clinical Principles
HealthX AI is **NOT an autonomous medical decision maker**.
The AI strictly enforces the following rules:
1. **Refusal of Autonomous Diagnoses**: When asked "What disease do I have?", the AI replies:
   *"I can explain what your records show, but I can't establish a diagnosis from these records alone."*
2. **Refusal to Alter or Stop Medications**: When asked "Should I stop my medicine?", the AI provides safe guidance and advises immediate doctor consultation.
3. **Refusal of Invented Dosages**: When asked "Give me a dosage", the AI strictly provides dosages documented on authorized prescriptions. If unrecorded, it explicitly refuses to invent one.
4. **Insufficient Evidence Fallback**: When records lack evidence to answer reliably, the AI responds:
   *"I couldn't find enough information in your HealthX records to answer that reliably."*

## Provider Abstraction
```typescript
interface LLMProvider {
  chat(prompt, contextChunks, options): Promise<Response>;
  summarize(text): Promise<string>;
  explain(labResult, context): Promise<string>;
  extract(text): Promise<ExtractedEntity[]>;
  translate(text, targetLang): Promise<string>;
}
```
Implemented via `LocalLLMProvider` (local deterministic engine) and `OpenAILLMProvider` (cloud API connector).
