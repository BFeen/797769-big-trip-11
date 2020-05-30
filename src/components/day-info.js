import AbstractComponent from "./abstract-component.js";


const createDayInfoTemplate = (day, counter) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${counter}</span>
        <time class="day__date">${day}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class DayInfoComponent extends AbstractComponent {
  constructor(day, counter) {
    super();

    this._day = day ? day : ``;
    this._counter = counter ? counter : ``;
  }

  getTemplate() {
    return createDayInfoTemplate(this._day, this._counter);
  }

  getEventsListContainer() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
