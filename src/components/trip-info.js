import AbstractComponent from "./abstract-component.js";


const createTripInfoTemplate = (price) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

            <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
        </div>

        <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
        </p>
    </section>`
  );
};

export default class TripInfoComponent extends AbstractComponent {
  constructor(price) {
    super();

    this._price = price;
  }

  getTemplate() {
    return createTripInfoTemplate(this._price);
  }
}
