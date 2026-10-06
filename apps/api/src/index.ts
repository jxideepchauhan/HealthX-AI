import { app } from './app';

const PORT = process.env.PORT || 4000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[HealthX AI] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[HealthX AI] Local access: http://localhost:${PORT}`);
  console.log(`[HealthX AI] OpenAPI documentation: http://localhost:${PORT}/docs`);
});
