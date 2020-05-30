import AbstractComponent from "./abstract-component";


const createAddEventButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class AddEventButton extends AbstractComponent {
  getTemplate() {
    return createAddEventButtonTemplate();
  }

  setAddNewEventHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  disableButton() {
    this.getElement().disabled = true;
  }

  enableButton() {
    this.getElement().disabled = false;
  }
}
