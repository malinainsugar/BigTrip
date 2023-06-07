import dayjs from 'dayjs';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getRandomArrayElement = (array) => array[getRandomInt(0, array.length - 1)];

const getDateAndTime = (date) => dayjs(date).format('DD/MM/YY hh:mm');

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

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

const getDifference = (oneDate, secondDate) => dayjs(secondDate).diff(oneDate);

const sortByDay = (points) => points.sort((pointA, pointB) => getDifference(pointB.dateFrom, pointA.dateFrom));

const sortByTime = (points) => points.sort((pointA, pointB) => getDifference(pointA.dateFrom, pointA.dateTo) - getDifference(pointB.dateFrom, pointB.dateTo, 'second'));

const sortByPrice = (points) => points.sort((pointA, pointB) => pointA.basePrice - pointB.basePrice);

export {getRandomArrayElement, getRandomInt, getDateAndTime, createRandomDates, updateItem, sortByDay, sortByTime, sortByPrice};
