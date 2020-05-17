export default class EventsModel {
  constructor() {
    this._events = [];
    
    this._dataChangeHandlers = [];
}

  getEvents() {
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

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}