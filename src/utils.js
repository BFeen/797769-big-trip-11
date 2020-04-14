export const capitalizeFirstLetter = (string) => {
  return new String(string.charAt(0).toUpperCase() + string.slice(1));
};

const timeFormat = (value) => {
    return String(value).padStart(2, `0`);
};
  
export const generateTime = (date) => {
  const hours = timeFormat(date.getHours());
  const minutes = timeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};
  