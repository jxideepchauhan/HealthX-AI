-- HealthX AI Initial Migration with PostgreSQL and pgvector
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "identifier" VARCHAR(255) UNIQUE NOT NULL,
    "role" VARCHAR(50) DEFAULT 'PATIENT',
    "otpHash" VARCHAR(255),
    "otpSalt" VARCHAR(255),
    "otpExpiresAt" TIMESTAMP WITH TIME ZONE,
    "failedOtpCount" INT DEFAULT 0,
    "lockedUntil" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS "Profile" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "dob" VARCHAR(50) NOT NULL,
    "sex" VARCHAR(20) NOT NULL,
    "preferredLanguage" VARCHAR(50) DEFAULT 'English',
    "location" VARCHAR(255) NOT NULL,
    "bloodGroup" VARCHAR(10) NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "allergiesJson" TEXT DEFAULT '[]',
    "importantMedicalInformation" TEXT DEFAULT 'None reported',
    "regularDoctor" VARCHAR(255),
    "regularHospital" VARCHAR(255),
    "sleepHours" VARCHAR(50),
    "exerciseHabits" VARCHAR(255),
    "dailySteps" INT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE IF NOT EXISTS "Document" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES "User"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(50) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "fileSize" INT NOT NULL,
    "storageKey" VARCHAR(500) NOT NULL,
    "fileHash" VARCHAR(64) NOT NULL,
    "processingStatus" VARCHAR(50) DEFAULT 'QUEUED',
    "duplicateOfId" UUID,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_doc_user" ON "Document"("userId");
CREATE INDEX IF NOT EXISTS "idx_doc_hash" ON "Document"("fileHash");

-- Embeddings with Vector representation
CREATE TABLE IF NOT EXISTS "Embedding" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES "User"("id") ON DELETE CASCADE,
    "documentId" UUID REFERENCES "Document"("id") ON DELETE CASCADE,
    "chunkId" VARCHAR(255) NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embeddingVector" vector(64),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_embedding_user" ON "Embedding"("userId");
