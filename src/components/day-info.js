import AbstractComponent from "./abstract-component.js";
import {formatDay} from "../utils/common.js";


const createDayInfoTemplate = (day, counter) => {
  const dayCounter = counter ? counter : ``;
  const date = day ? day : ``;
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayCounter}</span>
        <time class="day__date" datetime="">${date}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
}

export default class DayInfoComponent extends AbstractComponent {
  constructor(day, counter) {
    super();

    this._day = day;
    this._counter = counter;
  }

  getTemplate() {
    return createDayInfoTemplate(this._day, this._counter);
  }
}
  