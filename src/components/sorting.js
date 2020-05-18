import AbstractComponent from "./abstract-component.js";


export const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

const createSortTemplate = (sortType) => {
  const isDayRendering = sortType === SortType.EVENT ? `Day` : ``;
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">${isDayRendering}</span>

        <div class="trip-sort__item  trip-sort__item--event">
            <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.EVENT}" checked>
            <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--time">
            <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.TIME}">
            <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="sort-time">Time</label>
        </div>

        <div class="trip-sort__item  trip-sort__item--price">
            <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${SortType.PRICE}">
            <label class="trip-sort__btn" for="sort-price">Price</label>
        </div>

        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class SortingComponent extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.EVENT;
  }
  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const sortType = evt.target.value;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
