import AbstractComponent from "./abstract-component.js";


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

export default class FiltersComponent extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
