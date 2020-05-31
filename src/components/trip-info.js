import AbstractComponent from "./abstract-component.js";


const createTripInfoTemplate = (totalCost) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

            <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
        </div>

        <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
    </section>`
  );
};

export default class TripInfoComponent extends AbstractComponent {
  constructor() {
    super();

    this._events = null;
    this._totalCost = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._totalCost);
  }
}
