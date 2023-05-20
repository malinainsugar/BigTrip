import dayjs from 'dayjs';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getRandomArrayElement = (array) => array[getRandomInt(0, array.length - 1)];

const getDateAndTime = (date) => dayjs(date).format('DD/MM/YY hh:mm');

export {getRandomArrayElement, getRandomInt, getDateAndTime};
