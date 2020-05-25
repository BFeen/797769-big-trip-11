const createOfferType = (offers) => {
  const myOffers = offers.slice();

  for (let offer of myOffers) {
    offer.type = offer.title.replace(/\s/ig, '-').toLowerCase();
  }
  return myOffers;
}

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
    this.selectedOffers = createOfferType(data[`offers`])
    this.totalPrice = this.selectedOffers.length ? createTotalPrice(this.selectedOffers) + this.price : this.price;
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  static parseEvent(data) {
    //   console.log(data)
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }
}