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
    const getEventsByDay = (currentDay) => {
      return events.filter((event) => formatDay(event.dateStart) === currentDay);
    };
    return {
      day,
      eventsGroup: getEventsByDay(day),
    };
  });

  eventsByDay
    .forEach((dayEvents, index) => {
      const {day, eventsGroup} = dayEvents;
      const dayElement = renderDay(tripDaysComponent, day, index + 1);

      eventControllers = eventControllers.concat(renderEvents(dayElement, eventsGroup, onDataChange, onViewChange));
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

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
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
  }

  _onDataChange(eventController, oldData, newData) {
    const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

    if (isSuccess) {
      eventController.render(newData);
    }
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
      const tripEventListElement = renderDay(this._tripDaysComponent);

      newEvents = renderEvents(tripEventListElement, sortedEvents, this._onDataChange, this._onViewChange);
    }
    this._eventControllers = newEvents;
  }
}
