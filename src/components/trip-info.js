import AbstractComponent from "./abstract-component.js";
import {formatDay} from "../utils/common.js";


const createTripInfoTemplate = (tripInfo, datesInfo, totalCost) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${tripInfo}</h1>

            <p class="trip-info__dates">${datesInfo}</p>
        </div>

        <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
    </section>`
  );
};

export default class TripInfoComponent extends AbstractComponent {
  constructor(events) {
    super();

    this._events = events.slice();

    this._tripInfo = this._getTripInfo();;
    this._totalCost = this._getTotalCost();;
    this._datesInfo = this._getTripInfoDates();;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo, this._datesInfo, this._totalCost);
  }

  _getTripInfo() {
    const dash = ` &mdash; `;
    const cities = this._events.map((event) => event.destination.name);
    const citiesLength = cities.length;

    if (citiesLength > 3) {
      return `${cities[0]}${dash}...${dash}${cities[citiesLength - 1]}`;
    }

    return cities.join(`${dash}`);
  }

  _getTripInfoDates() {
    let dateFrom = this._events[0].dateStart;
    let dateTo = this._events[this._events.length - 1].dateEnd;
    const delimiter = `&nbsp;&mdash;&nbsp;`;

    const sameMonth = dateFrom.getMonth() === dateTo.getMonth();
    
    dateFrom = formatDay(dateFrom).toUpperCase();
    dateTo = formatDay(dateTo).toUpperCase();

    if (sameMonth) {
      return `${dateFrom}${delimiter}${dateTo.slice(3)}`;
    }

    return `${dateFrom}${delimiter}${dateTo}`;
  }

  _getTotalCost() {
    return this._events.reduce((acc, event) => acc + event.totalPrice, 0);
  }
}
