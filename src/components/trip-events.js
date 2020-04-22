import {createElement} from "../utils.js";


const createTripEventsTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
};

export default class TripEventsComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    createTripEventsTemplate();
  }

  getElement() {
    if (!this._element) {
        this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
      this._element = null;
  }
}
