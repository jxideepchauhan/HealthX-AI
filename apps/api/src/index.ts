import { app } from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[HealthX AI] Server running on http://localhost:${PORT}`);
  console.log(`[HealthX AI] OpenAPI documentation available at http://localhost:${PORT}/docs`);
});
