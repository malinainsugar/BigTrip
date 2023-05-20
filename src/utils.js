const getRandomInt = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (array) => array[getRandomInt(0, array.length - 1)];

export {getRandomArrayElement, getRandomInt};
