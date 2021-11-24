import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchForm = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchForm.addEventListener('input', debounce(countrySearchInputHandler, DEBOUNCE_DELAY));

function countrySearchInputHandler(e) {
  e.preventDefault();
  clearCountryList();
  const searchQuery = e.target.value.trim();
  if (searchQuery)
    fetchCountries(searchQuery)
      .then(data => {
        if (data.length > 10) {
          Notify.failure('Too many matches found. Please enter a more specific name.');
        } else if (data.status === 404) {
          Notify.failure('Oops, there is no country with that name');
        } else if (data.length === 1) {
          const markupOneCountry = createArticlesOneCountry(data);
          countryList.innerHTML = markupOneCountry;
        } else if (data.length <= 10) {
          const markupManyCountry = createCountriesList(data);
          countryInfo.innerHTML = markupManyCountry;
        }
      })
      .catch(Error => {
        Notify.failure('You must enter query parameters!');
      });
}

const createCountriesList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};
const createArticlesOneCountry = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) => `<h1><img src="${flags.png}" alt="${
      name.official
    }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

function clearCountryList() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
