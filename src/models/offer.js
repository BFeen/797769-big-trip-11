import {createOfferType} from "../utils/common.js";

export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = createOfferType(data[`offers`]);
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}