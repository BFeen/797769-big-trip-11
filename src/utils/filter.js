import {FilterType} from "../const";

export const getFutureEvents = (events, today) => {
  return events.filter((event) => event.startDate > today);
};

export const getPastEvents = (events, today) => {
  return events.filter((event) => event.startDate < today);
};

export const getEventsByFilter = (events, filterType) => {
  const today = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return events;
    case FilterType.FUTURE:
      return getFutureEvents(events, today);
    case FilterType.PAST:
      return getPastEvents(events, today);
  }

  return events;
};
