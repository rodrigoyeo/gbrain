import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'fs';

// Arkode downstream recall gate: vector search must set pgvector HNSW ef_search
// inside the same transaction as the ANN query. Supabase transaction poolers can
// ignore URL/session-level options, so this must live in PostgresEngine.searchVector.
describe('PostgresEngine vector search recall guard', () => {
  test('searchVector sets transaction-local hnsw.ef_search before querying', () => {
    const src = readFileSync(new URL('../src/core/postgres-engine.ts', import.meta.url), 'utf8');
    const methodStart = src.indexOf('async searchVector(');
    const nextMethod = src.indexOf('\n  async getEmbeddingsByChunkIds', methodStart);
    expect(methodStart).toBeGreaterThan(-1);
    expect(nextMethod).toBeGreaterThan(methodStart);
    const method = src.slice(methodStart, nextMethod);
    expect(method).toContain("SET LOCAL hnsw.ef_search = 400");
    expect(method.indexOf("SET LOCAL hnsw.ef_search = 400")).toBeLessThan(method.indexOf('sql.unsafe(rawQuery'));
  });
});
