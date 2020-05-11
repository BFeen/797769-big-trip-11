import AbstractComponent from "./abstract-component.js";


const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TripDaysComponent extends AbstractComponent {
  getTemplate() {
    return createTripDaysTemplate();
  }
}
