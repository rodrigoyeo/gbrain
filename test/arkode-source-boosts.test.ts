import { describe, expect, test } from 'bun:test';
import { DEFAULT_SOURCE_BOOSTS } from '../src/core/search/source-boost.ts';

describe('Arkode curated source boosts', () => {
  test('prefer canonical Arkode brain pages over daily, meeting, and knowledge noise', () => {
    for (const prefix of ['brand/', 'rules/', 'methodology/', 'icp/', 'odoo-19/', 'patterns/', 'references/', 'company/']) {
      expect(DEFAULT_SOURCE_BOOSTS[prefix]).toBeGreaterThan(1);
    }
    for (const prefix of ['daily-', 'meeting-', 'knowledge-']) {
      expect(DEFAULT_SOURCE_BOOSTS[prefix]).toBeLessThan(1);
    }
  });
});
