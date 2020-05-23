import {getEventsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";


export default class EventsModel {
  constructor() {
    this._events = [];
    this._activeFilter = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  addEvent(event) {
    const index = this._events.findIndex((item) => item.dateStart > event.dateStart);

    if (index === -1) {
      this._events.push(event);
    } else {
      this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index));
    }

    this._callHandlers(this._dataChangeHandlers);
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilter);
  }

  getEventsAll() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._dataChangeHandlers);
  }

  removeEvent(id) {
    const index = this._events.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  resetFilter() {
    this._activeFilter = FilterType.EVERYTHING;
    document.querySelector(`#filter-everything`).checked = true;
    this._callHandlers(this._filterChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilter = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
