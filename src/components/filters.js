import AbstractComponent from "./abstract-component.js";


const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (tagId) => {
  return tagId.substring(FILTER_ID_PREFIX.length);
};

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
    .map((filter) => createFilterMarkup(filter.name, filter.checked)).join(`\n`);

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

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
