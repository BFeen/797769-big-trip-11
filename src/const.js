const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const EventTypes = {
  TRANSFER: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  ACTIVITY: [`check-in`, `sightseeing`, `restaurant`],
};

const EmptyDestination = {
  name: ``,
  description: ``,
  pictures: [],
};

export {FilterType, EventTypes, EmptyDestination};
