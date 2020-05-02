import EditFormComponent from "./components/edit-event.js";
import FiltersComponent from "./components/filters.js";
import MenuComponent from "./components/menu.js";
import NoEventsComponent from "./components/no-events.js";
import SortingComponent from "./components/sorting.js";
import TripInfoComponent from "./components/trip-info.js";
import TripDaysComponent from "./components/trip-days.js";
import TripEventComponent from "./components/trip-event.js";
import TripEventsComponent from "./components/trip-events.js";
import {generateFilters} from "./mock/filters.js";
import {generateEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils/render.js";


const EVENT_COUNT = 5;

const renderEvents = (tripEventsListElement, event) => {
  const onEditButtonClick = () => {
    tripEventsListElement.replaceChild(editFormComponent.getElement(), tripEventComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onEditFormClose = () => {
    tripEventsListElement.replaceChild(tripEventComponent.getElement(), editFormComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      tripEventsListElement.replaceChild(tripEventComponent.getElement(), editFormComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const tripEventComponent = new TripEventComponent(event);
  tripEventComponent.setEditButtonClickHandler(onEditButtonClick);

  const editFormComponent = new EditFormComponent(event);
  editFormComponent.setCloseEditButtonClickHandler(onEditFormClose);

  render(tripEventsListElement, tripEventComponent, RenderPosition.BEFOREEND);
};

const renderTripEvents = (tripEventsComponent, events) => {
  let totalPrice = 0;
  if (events.length === 0) {
    render(tripEventsComponent.getElement(), new NoEventsComponent(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(tripEventsComponent.getElement(), new SortingComponent(), RenderPosition.BEFOREEND);

  const tripDaysComponent = new TripDaysComponent();
  render(tripEventsComponent.getElement(), tripDaysComponent, RenderPosition.BEFOREEND);

  const tripEventsListElement = tripDaysComponent.getElement().querySelector(`.trip-events__list`);
  events
    .forEach((event) => {
      renderEvents(tripEventsListElement, event);
      totalPrice = totalPrice + event.price;
    });
};

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const filters = generateFilters();

render(tripControls, new MenuComponent(), RenderPosition.AFTERBEGIN);
render(tripControls, new FiltersComponent(filters), RenderPosition.BEFOREEND);

const events = generateEvents(EVENT_COUNT);

const main = document.querySelector(`.page-main`);
const mainContainer = main.querySelector(`.page-body__container`);
const tripEventsComponent = new TripEventsComponent();
render(mainContainer, tripEventsComponent, RenderPosition.BEFOREEND);
renderTripEvents(tripEventsComponent, events);

render(tripMain, new TripInfoComponent(0), RenderPosition.AFTERBEGIN);
