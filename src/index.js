import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const card = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput() {
  const countryName = inputEl.value.trim();
  listEl.innerHTML = '';
  card.innerHTML = '';

  if (countryName === '') {
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      // console.log(data);
      if (data.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (data.length === 1) {
        const markup = createMarkupCard(data[0]);
        card.insertAdjacentHTML('beforeend', markup);
      } else {
        const markup = createMarkupList(data);
        listEl.insertAdjacentHTML('beforeend', markup);
      }
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupList(arr) {
  return arr
    .map(
      ({ flags, name }) => `<li class="country-list-item">
  <img src="${flags.svg}" alt="flag ${name.official}" width = "30" />
  <h2 class="country-title">${name.common}</h2>
  </li>`
    )
    .join('');
}

function createMarkupCard(arr) {
  const { flags, name, capital, population, languages } = arr;
  return `<h2 class="country-info-title"><img src="${flags.svg}" alt="flag ${
    name.official
  }" width = "30" />
  ${name.common}</h2>
  <p><b>Capital:</b> ${capital}</p>
  <p><b>Population:</b> ${population}</p>
  <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`;
}
