# HealthX AI — Production Deployment Guide (Sections 60, 84, 85)

## Production Deployment with Docker Compose
To launch the complete HealthX AI cluster:
```bash
docker compose up -d --build
```
This deploys:
1. `web`: Next.js frontend (port 3000)
2. `api`: Express API gateway (port 4000)
3. `ml-service`: Python FastAPI ML service (port 8000)
4. `postgres`: PostgreSQL 16 with pgvector extension (port 5432)
5. `redis`: Redis 7 cache and job queue (port 6379)
6. `minio`: S3-compatible encrypted object store (port 9000, console 9001)

## Zero-Dependency Local Development
For development environments where Docker or PostgreSQL are not running:
```bash
# 1. Install dependencies
npm install

# 2. Push database schema (SQLite dev.db)
npm --workspace=@healthx/database run db:push

# 3. Seed verified test data
npm --workspace=@healthx/database run db:seed

# 4. Run API gateway
npm --workspace=@healthx/api run dev

# 5. Run Web frontend
npm --workspace=@healthx/web run dev

# 6. Run Python ML service
cd apps/ml-service
uvicorn main:app --port 8000
```
