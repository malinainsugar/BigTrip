import dayjs from 'dayjs';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getRandomArrayElement = (array) => array[getRandomInt(0, array.length - 1)];

const getDateAndTime = (date) => dayjs(date).format('DD/MM/YY hh:mm');

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const isFirstDateBeforeSecond = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom)) > 0;

const getRandomDate = () => dayjs()
  .add(getRandomInt(-7, 7), 'day')
  .add(getRandomInt(1, 23), 'hour')
  .add(getRandomInt(1, 59), 'minute');

const createRandomDates = () => {
  const oneDate = getRandomDate();
  const secondDate = getRandomDate();
  if (oneDate.isBefore(secondDate)) {
    return {
      dateFrom: oneDate.toISOString(),
      dateTo: secondDate.toISOString()
    };
  }
  return {
    dateFrom: secondDate.toISOString(),
    dateTo: oneDate.toISOString()
  };
};

export {getRandomArrayElement, getRandomInt, getDateAndTime, createRandomDates, updateItem, isFirstDateBeforeSecond};
