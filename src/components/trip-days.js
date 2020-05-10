import AbstractComponent from "./abstract-component.js";
import {MONTH_NAMES} from "../const.js";


const createDaysInfoTemplate = (days) => {
  let template = ``;
  if (days.length > 0) {
    let counter = 0;
    template = 
      `<ul class="trip-days">
        ${days.map((day) => {
          counter++;
          return (
            `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${counter}</span>
                <time class="day__date" datetime="">${day}</time>
              </div>
              <ul class="trip-events__list"></ul>
            </li>`
          );
        }).join(`\n`)}
      </ul>`;
  } else {
    template = `
    <ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter"></span>
          <time class="day__date" datetime=""></time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>
    </ul>`;
  }

  return template;
};

export default class TripDaysComponent extends AbstractComponent {
  constructor(days) {
    super();

    this._days = days;
  }

  getTemplate() {
    return createDaysInfoTemplate(this._days);
  }

  removeDays() {
    this._days = [];
  }
}
