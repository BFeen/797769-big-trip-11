import {createElement} from "../utils.js";


const createFilterMarkup = (filterName, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input 
      id="filter-${filterName}" 
      class="trip-filters__filter-input  visually-hidden" type="radio" 
      name="trip-filter" value="${filterName}" 
      ${ isChecked ? `checked` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters
    .map((filter, count) => createFilterMarkup(filter, count === 0)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
        
      ${filtersMarkup}

        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersComponent {
  constructor(filters) {
    this._filters = filters;  

    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
