import AbstractComponent from "./abstract-component";


const createAddEventButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class AddEventButton extends AbstractComponent {
  constructor() {
    super();

    this._disable = false;
  }
  getTemplate() {
    return createAddEventButtonTemplate();
  }

  setAddNewEventHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  changeButtonStatus() {
    this.getElement().disabled = !this._disable;
  }
}
