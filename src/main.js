import AddEventButtonComponent from "./components/add-event-button.js";
import EventsModel from "./models/trip-events.js";
import FilterController from "./controllers/filter-controller.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip-controller.js";
import TripEventsComponent from "./components/trip-events.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils/render.js";


const EVENT_COUNT = 6;

const events = generateEvents(EVENT_COUNT);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const main = document.querySelector(`.page-main`);
const mainContainer = main.querySelector(`.page-body__container`);

const menuComponent = new MenuComponent();
const addEventButtonComponent = new AddEventButtonComponent();
const tripEventsComponent = new TripEventsComponent();

const tripController = new TripController(tripEventsComponent, eventsModel, addEventButtonComponent);
const filterController = new FilterController(tripControls, eventsModel);
const statisticsComponent = new StatisticsComponent(eventsModel);

render(tripControls, menuComponent, RenderPosition.AFTER_BEGIN);
filterController.render();
render(tripMain, addEventButtonComponent, RenderPosition.BEFORE_END);
render(mainContainer, tripEventsComponent, RenderPosition.BEFORE_END);
tripController.render();
render(mainContainer, statisticsComponent, RenderPosition.BEFORE_END);
statisticsComponent.hide();

render(tripMain, new TripInfoComponent(0), RenderPosition.AFTER_BEGIN);

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATISTICS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
  menuComponent.setActiveItem(menuItem);
});

addEventButtonComponent.setAddNewEventHandler(() => {
  tripController.createEvent();
});
