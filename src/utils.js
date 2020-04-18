const dateFormat = (value) => {
  return String(value).padStart(2, `0`);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateTime = (date) => {
  const hours = dateFormat(date.getHours());
  const minutes = dateFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const generateDate = (date) => {
  const day = dateFormat(date.getDate());
  const month = dateFormat(date.getMonth());
  const year = dateFormat(date.getYear());

  return `${day}/${month}/${year}`;
};
