import AbstractComponent from "./abstract-component.js";
import {formatDay} from "../utils/common.js";


const createDayInfoTemplate = (day, counter) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${counter}</span>
        <time class="day__date" datetime="">${day}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
}

export default class DayInfoComponent extends AbstractComponent {
  constructor(day, counter) {
    super();

    this._day = day ? day : ``;
    this._counter = counter ? counter : ``;
  }

  getTemplate() {
    return createDayInfoTemplate(this._day, this._counter);
  }
}
  