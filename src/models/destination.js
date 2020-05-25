export default class Destination {
    constructor(data) {
      this.destination = data[`description`];
      this.name = data[`name`];
      this.pictures = data[`pictures`];
    }
  
    static parseDestination(data) {
      return new Destination(data);
    }
  
    static parseDestinations(data) {
      return data.map(Destination.parseDestination);
    }
  }