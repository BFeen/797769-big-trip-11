import DayInfoComponent from "../components/day-info";
import EventController from "./event-controller";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, RenderPosition} from "../utils/render";
import {formatDay} from "../utils/common.js";


const renderEvents = (eventsListElement, events, onDataChange, onViewChange) => {
  return events.map((event) => {
    const eventController = new EventController(eventsListElement, onDataChange, onViewChange);
    eventController.render(event);

    return eventController;
  });
};

const renderDay = (tripDaysComponent, day, counter) => {
  const dayInfoComponent = new DayInfoComponent(day, counter);
  render(tripDaysComponent.getElement(), dayInfoComponent, RenderPosition.BEFOREEND);

  return dayInfoComponent.getElement().querySelector(`.trip-events__list`);
};

const renderDays = (tripDaysComponent, events, onDataChange, onViewChange) => {
  const days = getUniqueDays(events);
  let eventControllers = [];

  const eventsByDay = days.map((day) => {
    const getEventsByDay = (day) => {
      return events.filter((event) => formatDay(event.dateStart) === day);
    };
    return {
      day,
      events: getEventsByDay(day),
    };
  });

  eventsByDay
    .forEach((dayEvents, index) => {
      const {day, events} = dayEvents;
      const dayElement = renderDay(tripDaysComponent, day, index + 1);

      eventControllers = eventControllers.concat(renderEvents(dayElement, events, onDataChange, onViewChange));
    });

  return eventControllers;
};

const getUniqueDays = (events) => {
  const days = [];

  for (const event of events) {
    const eventDay = formatDay(event.dateStart);
    if (!days.includes(eventDay)) {
      days.push(eventDay);
    }
  }

  return days;
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
  constructor(container) {
    this._container = container;

    this._events = [];
    this._eventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events;
    const container = this._container.getElement();

    if (this._events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    const newEvents = renderDays(this._tripDaysComponent, this._events, this._onDataChange, this._onViewChange);
    this._eventControllers = this._eventControllers.concat(newEvents);
  }

  _onDataChange(eventController, oldData, newData) {
    const index = this._events.findIndex((item) => item === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    eventController.render(this._events[index]);
  }

  _onViewChange() {
    this._eventControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._events, sortType);
    let newEvents;

    this._tripDaysComponent.getElement().innerHTML = ``;

    if (sortType === SortType.EVENT) {
      newEvents = renderDays(this._tripDaysComponent, sortedEvents, this._onDataChange, this._onViewChange);
    } else {
      const tripEventListElement = renderDay(this._tripDaysComponent);

      newEvents = renderEvents(tripEventListElement, sortedEvents, this._onDataChange, this._onViewChange);
    }
    this._eventControllers = newEvents;
    console.log(this._eventControllers);
  }
}
