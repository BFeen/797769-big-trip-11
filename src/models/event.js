const createTotalPrice = (offers) => {
  let sum = 0;
  for (let offer of offers) {
    sum += offer.price;
  }
  return sum;
}

export default class Event {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`];
    this.price = data[`base_price`];
    this.dateStart = new Date(data[`date_from`]);
    this.dateEnd = new Date(data[`date_to`]);
    this.selectedOffers = data[`offers`];
    this.totalPrice = this.selectedOffers.length ? (createTotalPrice(this.selectedOffers) + this.price) : this.price;
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": this.destination,
      "base_price": this.price,
      "date_from": this.dateStart.toISOString(),
      "date_to": this.dateEnd.toISOString(),
      "offers": this.selectedOffers,
      "is_favorite": this.isFavorite,
    }
  }

  static parseEvent(data) {
    //   console.log(data)
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}