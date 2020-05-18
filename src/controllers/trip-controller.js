import DayInfoComponent from "../components/day-info";
import EventController from "./event-controller";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, remove, RenderPosition} from "../utils/render";
import {formatDay} from "../utils/common.js";
import moment from "moment";


const getUniqueDays = (events) => {
  const days = events.map((event) => {
    return moment(event.dateStart).format(`MMM DD`);
  });
  return [...new Set(days)];
};

const renderEvents = (eventsListElement, events, onDataChange, onViewChange) => {
  return events.map((event) => {
    const eventController = new EventController(eventsListElement, onDataChange, onViewChange);
    eventController.render(event);

    return eventController;
  });
};

const getRenderedDay = (tripDaysComponent, day, counter) => {
  const dayInfoComponent = new DayInfoComponent(day, counter);
  render(tripDaysComponent.getElement(), dayInfoComponent, RenderPosition.BEFOREEND);

  return dayInfoComponent.getElement().querySelector(`.trip-events__list`);
};

const generateEventsByDay = (events) => {
  const days = getUniqueDays(events);

  return days.map((day) => {
    return {
      day,
      eventsGroup: events.filter((event) => formatDay(event.dateStart) === day),
    }
  });
}

const renderDays = (tripDaysComponent, events, onDataChange, onViewChange) => {
  const eventsByDay = generateEventsByDay(events);
  let eventControllers = [];

  eventsByDay
    .map((dayEvents, index) => {
      const {day, eventsGroup} = dayEvents;
      const dayElement = getRenderedDay(tripDaysComponent, day, index + 1);
      eventControllers = eventControllers.concat(renderEvents(dayElement, eventsGroup, onDataChange, onViewChange));
    });
  return eventControllers;
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const showingEvents = events.slice();
  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = showingEvents;
      break;
    case SortType.TIME:
      sortedEvents = showingEvents
        .sort((a, b) => (b.dateEnd - b.dateStart) - (a.dateEnd - a.dateStart));
      break;
    case SortType.PRICE:
      sortedEvents = showingEvents
        .sort((a, b) => b.totalPrice - a.totalPrice);
      break;
  }

  return sortedEvents;
};

export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._eventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const events = this._eventsModel.getEvents();

    if (events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    const newEvents = renderDays(this._tripDaysComponent, events, this._onDataChange, this._onViewChange);
    this._eventControllers = this._eventControllers.concat(newEvents);
    console.log(this._tripDaysComponent)
  }

  removeEvents() {
    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _renderEvents(events) {
    const newEvents = renderDays(this._tripDaysComponent, events, this._onDataChange, this._onViewChange);
    this._eventControllers = newEvents;  //this._eventControllers.concat(newEvents);
  }

  _onDataChange(eventController, oldData, newData) {
    const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

    if (isSuccess) {
      eventController.render(newData);
    }
  }

  _onFilterChange() {
    this._updateEvents();
  }

  _onViewChange() {
    this._eventControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);
    let newEvents;

    this._tripDaysComponent.getElement().innerHTML = ``;

    if (sortType === SortType.EVENT) {
      newEvents = renderDays(this._tripDaysComponent, sortedEvents, this._onDataChange, this._onViewChange);
    } else {
      // удаление "DAY" из сортировки
      const tripEventListElement = getRenderedDay(this._tripDaysComponent);

      newEvents = renderEvents(tripEventListElement, sortedEvents, this._onDataChange, this._onViewChange);
    }
    this._eventControllers = newEvents;
  }

  _updateEvents() {
    this.removeEvents();
    this._renderEvents(this._eventsModel.getEvents());
  }
}
