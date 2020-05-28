import AbstractComponent from "./abstract-component.js";

const StatusMessages = {
  NO_EVENTS: `Click New Event to create your first point.`,
  LOADING: `Loading...`,
  ERROR: `Something went wrong.`,
};

const createNoEventsTemplate = () => {
  return (
    `<p class="trip-events__msg">${StatusMessages.NO_EVENTS}</p>`
  );
};

export default class NoEventsComponent extends AbstractComponent {
  getTemplate() {
    return createNoEventsTemplate();
  }

  setNoEventsView() {
    this.getElement().textContent = StatusMessages.NO_EVENTS;
  }

  setLoadingView() {
    this.getElement().textContent = StatusMessages.LOADING;
  }

  setErrorView(msg) {
    this.getElement().textContent = `${StatusMessages.ERROR}. ${msg}`;
  }
}
