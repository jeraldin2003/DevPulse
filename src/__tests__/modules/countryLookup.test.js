import { describe, it, expect } from 'vitest';
import { countryLookup } from '~/features/dashboard/utils/countryLookup.js';

describe('countryLookup module', () => {
  it('should handle empty arrays', () => {
    const res = countryLookup([]);
    expect(res).toEqual({ totalCountries: 0, top10CountriesByPopulation: [] });
  });

  it('should find total countries and top 10 by population', () => {
    const input = [
      { name: { common: 'Country A' }, population: 100 },
      { name: { common: 'Country B' }, population: 1000 },
      { name: { common: 'Country C' }, population: 50 },
    ];

    const res = countryLookup(input);

    expect(res.totalCountries).toBe(3);
    expect(res.top10CountriesByPopulation).toHaveLength(3);

    // Ordered descending by population
    expect(res.top10CountriesByPopulation[0].name).toBe('Country B');
    expect(res.top10CountriesByPopulation[1].name).toBe('Country A');
    expect(res.top10CountriesByPopulation[2].name).toBe('Country C');
  });
});
