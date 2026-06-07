
  function getTotalCountries(countries) {
    let count = 0;
  
    for (let i = 0; i < countries.length; i++) {
      count = count + 1;
    }
  
    return count;
  }
  
  function sortByPopulationDescending(countries) {
    const sorted = [];
  
    for (let i = 0; i < countries.length; i++) {
      sorted.push(countries[i]);
    }
  
    for (let i = 0; i < sorted.length - 1; i++) {
      for (let j = 0; j < sorted.length - i - 1; j++) {
        if (sorted[j].population < sorted[j + 1].population) {
          const temp = sorted[j];
          sorted[j] = sorted[j + 1];
          sorted[j + 1] = temp;
        }
      }
    }
  
    return sorted;
  }
  
  function getTop10CountriesByPopulation(countries) {
    const sorted = sortByPopulationDescending(countries);
    const top10 = [];
  
    const limit = sorted.length < 10 ? sorted.length : 10;
  
    for (let i = 0; i < limit; i++) {
      const country = sorted[i];
  
      top10.push({
        name: country.name.common,
        population: country.population,
      });
    }
  
    return top10;
  }
  
  export function countryLookup(countries) {
    const totalCountries = getTotalCountries(countries);
    const top10CountriesByPopulation = getTop10CountriesByPopulation(countries);
  
    return {
      totalCountries,
      top10CountriesByPopulation,
    };
  }