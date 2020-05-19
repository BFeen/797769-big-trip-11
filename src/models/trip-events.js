import {getEventsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";


export default class EventsModel {
  constructor() {
    this._events = [];
    this._activeFilter = FilterType.EVERYTHING;
    
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    console.log(this._filterChangeHandlers)
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

  updateEvents(id, event) {
    const index = this._events.findIndex((item) => item.id === id);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
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