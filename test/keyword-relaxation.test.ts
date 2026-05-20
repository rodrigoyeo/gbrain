import { describe, expect, test } from 'bun:test';
import { buildRelaxedKeywordQuery } from '../src/core/postgres-engine.ts';

describe('buildRelaxedKeywordQuery', () => {
  test('turns a natural language question into a broad OR query for keyword fallback', () => {
    expect(buildRelaxedKeywordQuery('What colors and fonts should Arkode use in a premium landing page?'))
      .toBe('colors OR fonts OR arkode OR premium OR landing OR page');
  });

  test('does not relax underspecified or all-stopword prompts', () => {
    expect(buildRelaxedKeywordQuery('what should we do')).toBeNull();
    expect(buildRelaxedKeywordQuery('MESO')).toBeNull();
  });
});
