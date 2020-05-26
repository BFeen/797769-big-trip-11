import Event from "./models/event.js";
import Offer from "./models/offer.js"
import Destination from "./models/destination.js";


const Method = {
  GET: `GET`,
}

const Url = {
  EVENTS: `https://11.ecmascript.pages.academy/big-trip/points`,
  OFFERS: `https://11.ecmascript.pages.academy/big-trip/offers`,
  DESTINATIONS: `https://11.ecmascript.pages.academy/big-trip/destinations`,
}

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getData() {
    return Promise.all([
      this.getEvents(),
      this.getOffers(),
      this.getDestinations(),
    ])
      .then((response) => {
        const [events, offers, destinations] = response;
        return {
          events,
          offers,
          destinations,
        };
      });
  }

  getEvents() {
    return this._loadData({
      url: Url.EVENTS,
    })
      .then((response) => response.json())
      .then(Event.parseEvents);
  }

  getOffers() {
    return this._loadData({
      url: Url.OFFERS,
    })
      .then((response) => response.json())
      .then(Offer.parseOffers);
  }

  getDestinations() {
    return this._loadData({
      url: Url.DESTINATIONS,
    })
      .then((response) => response.json())
      .then(Destination.parseDestinations);
  }

  _loadData({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(url, {method, body, headers})
      .then(this._checkStatus) 
      .catch((error) => {
        throw error;
      });
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status <= 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
};

export default API;