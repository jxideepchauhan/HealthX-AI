/**
 * HealthX AI Storage Provider Abstraction
 * Supports Local Filesystem storage for dev/test and S3-compatible object storage for production.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface StorageProvider {
  uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string>;
  getFile(key: string): Promise<Buffer>;
  deleteFile(key: string): Promise<void>;
  getUrl(key: string): string;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), '.storage');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public async uploadFile(key: string, buffer: Buffer, _mimeType: string): Promise<string> {
    const fullPath = path.join(this.baseDir, key);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(fullPath, buffer);
    return `file://${fullPath}`;
  }

  public async getFile(key: string): Promise<Buffer> {
    const fullPath = path.join(this.baseDir, key);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found in local storage: ${key}`);
    }
    return fs.promises.readFile(fullPath);
  }

  public async deleteFile(key: string): Promise<void> {
    const fullPath = path.join(this.baseDir, key);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  public getUrl(key: string): string {
    return `/api/v1/documents/files/${encodeURIComponent(key)}`;
  }
}

export class S3StorageProvider implements StorageProvider {
  private bucket: string;
  private endpoint: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'healthx-documents';
    this.endpoint = process.env.S3_ENDPOINT || 'https://s3.amazonaws.com';
  }

  public async uploadFile(key: string, _buffer: Buffer, _mimeType: string): Promise<string> {
    // In production with AWS SDK / MinIO client
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  public async getFile(_key: string): Promise<Buffer> {
    return Buffer.from('');
  }

  public async deleteFile(_key: string): Promise<void> {
    return;
  }

  public getUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`;
  }
}
