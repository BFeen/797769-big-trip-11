import AddEventFormComponent from "./components/add-event-form.js";
import EditFormComponent from "./components/edit-event.js";
import FiltersComponent from "./components/filters.js";
import MenuComponent from "./components/menu.js";
import SortingComponent from "./components/sorting.js";
import TripInfoComponent from "./components/trip-info.js";
import TripDaysComponent from "./components/trip-days.js";
import TripEventComponent from "./components/trip-event.js";
import TripEventsComponent from "./components/trip-events.js"
import {generateFilters} from "./mock/filters.js";
import {generateEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils.js";


const EVENT_COUNT = 3;

const renderEvents = (tripEventsListElement, event) => {
  const onEditButtonClick = () => {
    tripEventsListElement.replaceChild(editFormComponent.getElement(), tripEventComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    tripEventsListElement.replaceChild(tripEventComponent.getElement(), editFormComponent.getElement());
  };

  const tripEventComponent = new TripEventComponent(event);
  const editButton = tripEventComponent.getElement().querySelector(`button`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const editFormComponent = new EditFormComponent(event);
  const editForm = editFormComponent.getElement().querySelector(`form`);
  const editFormCloseButton = editFormComponent.getElement().querySelector(`.event__rollup-btn`);

  editForm.addEventListener(`submit`, onEditFormSubmit);
  editFormCloseButton.addEventListener(`click`, onEditFormSubmit);

  render(tripEventsListElement, tripEventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderTripEvents = (tripEventsComponent, events) => {
  render(tripEventsComponent.getElement(), new SortingComponent().getElement(), RenderPosition.BEFOREEND);

  const tripDaysComponent = new TripDaysComponent();
  render(tripEventsComponent.getElement(), tripDaysComponent.getElement(), RenderPosition.BEFOREEND);
  
  let totalPrice = 0;
  
  const tripEventsListElement = tripDaysComponent.getElement().querySelector(`.trip-events__list`);
  events
    .forEach((event) => {
      renderEvents(tripEventsListElement, event);
      totalPrice = totalPrice + event.price;
    });
}

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const filters = generateFilters();

render(tripControls, new MenuComponent().getElement(), RenderPosition.AFTERBEGIN);
render(tripControls, new FiltersComponent(filters).getElement(), RenderPosition.BEFOREEND);

const events = generateEvents(EVENT_COUNT);

const main = document.querySelector(`.page-main`);
const mainContainer = main.querySelector(`.page-body__container`);
const tripEventsComponent = new TripEventsComponent();
render(mainContainer, tripEventsComponent.getElement(), RenderPosition.BEFOREEND);
renderTripEvents(tripEventsComponent, events);

render(tripMain, new TripInfoComponent().getElement(), RenderPosition.AFTERBEGIN);
