import AbstractComponent from "./abstract-component.js";


const createTripEventsTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
};

export default class TripEventsComponent extends AbstractComponent {
  getTemplate() {
    return createTripEventsTemplate();
  }
}
