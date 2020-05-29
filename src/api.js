import Event from "./models/event.js";
import Offer from "./models/offer.js";
import Destination from "./models/destination.js";


const checkStatus = (response) => {
  if (response.status >= 200 && response.status <= 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const API = class {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getData() {
    return Promise.all([
      this.getEvents(),
      this.getOffers(),
      this.getDestinations(),
    ])
      .then((response) => {
        const [events, offers, destinations] = response;
        events.sort((a, b) => a.dateStart - b.dateStart);
        return {
          events,
          offers,
          destinations,
        };
      });
  }

  getEvents() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(Event.parseEvents);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json())
      .then(Offer.parseOffers);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json())
      .then(Destination.parseDestinations);
  }

  updateEvent(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  createEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({"Content-type": `application/json`})
    })
    .then((response) => response.json())
    .then(Event.parseEvent);
  }

  deleteEvent(id) {
    return this._load({
      url: `points/${id}`,
      method: Method.DELETE,
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
};

export default API;
