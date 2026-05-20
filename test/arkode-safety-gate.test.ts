import { describe, expect, test } from 'bun:test';
import { applyArkodeSafetyGate } from '../src/core/search/hybrid.ts';
import type { SearchResult } from '../src/core/types.ts';

function result(slug: string): SearchResult {
  return {
    slug,
    title: slug,
    score: 1,
    chunk_id: 1,
    page_id: 1,
    type: 'concept',
    chunk_text: '',
    chunk_source: 'compiled_truth',
    chunk_index: 0,
    stale: false,
  };
}

describe('Arkode safety gate', () => {
  test('suppresses private HR questions even if a generic guardrail source is present', () => {
    const gated = applyArkodeSafetyGate('What is Arkode exact payroll policy for vacation days?', [
      result('rules/quality-gates'),
    ]);
    expect(gated).toEqual([]);
  });

  test('suppresses sensitive questions when no guardrail source is present', () => {
    const gated = applyArkodeSafetyGate('Which bank password should I use for Arkode account?', [
      result('icp/manufacturing'),
      result('daily-2026-04-08'),
    ]);
    expect(gated).toEqual([]);
  });

  test('keeps only guardrail pages for unsafe action requests', () => {
    const gated = applyArkodeSafetyGate('Quote a US Odoo prospect a single fixed price without Rodrigo review.', [
      result('methodology/meso-pricing'),
      result('rules/quality-gates'),
      result('odoo-19/module-catalog'),
      result('rules/non-negotiables'),
    ]);
    expect(gated.map(r => r.slug)).toEqual([
      'methodology/meso-pricing',
      'rules/quality-gates',
      'rules/non-negotiables',
    ]);
  });

  test('leaves ordinary retrieval untouched', () => {
    const rows = [result('brand/visual-identity'), result('icp/home-services-us')];
    expect(applyArkodeSafetyGate('What colors should Arkode use?', rows)).toBe(rows);
  });
});
