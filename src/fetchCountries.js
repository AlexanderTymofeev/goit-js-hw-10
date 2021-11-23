const BASE_URL = 'https://restcountries.com/v3.1/name';

const fetchCountries = name => {
  return fetch(`${BASE_URL}/${name}?fields=name,capital,population,flags,languages`).then(
    response => response.json(),
  );
};

export { fetchCountries };
