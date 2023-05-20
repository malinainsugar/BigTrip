import { getRandomInt, getRandomArrayElement } from '../utils';
import { createIDForDestination, createIDForOffer, createIDForPoint } from './counters';
import { DESTINATION_NAMES, OFFER_TITLES, TYPES_POINT, DESCRIPTIONS } from '../const';

const generatePhoto = () => ({
  'src': `http://picsum.photos/248/152?r=${getRandomInt(0, 10)}`,
  'description': getRandomArrayElement(DESCRIPTIONS)
});

const generateDestination = () => ({
  'id': createIDForDestination(),
  'description': getRandomArrayElement(DESCRIPTIONS),
  'name': getRandomArrayElement(DESTINATION_NAMES),
  'pictures': Array.from({length: getRandomInt(1,6)}, generatePhoto)
});

const generateOffer = () => ({
  'id': createIDForOffer(),
  'title': getRandomArrayElement(OFFER_TITLES),
  'price': getRandomInt(1, 200)
});

const generateOffersByType = () => {
  const arrayOffersByType = [];

  for (let i = 0; i < TYPES_POINT.length; i++) {
    arrayOffersByType[i] = {
      'type' : TYPES_POINT[i],
      'offers': Array.from({length : 3}, generateOffer)
    };
  }

  return arrayOffersByType;
};

const generatePoint = () => ({
  'basePrice': getRandomInt(1, 1500),
  'dateFrom': `2019-07-10T${getRandomInt(10,23)}:${getRandomInt(10,59)}:00.845Z`,
  'dateTo': `2019-07-11T${getRandomInt(10,23)}:${getRandomInt(10,59)}:00.375Z`,
  'id' : createIDForPoint(),
  'destination': generateDestination(),
  'isFavorite': getRandomInt(1, 2) === 1,
  'offers':  Array.from({ length: getRandomInt(2,5) }, generateOffer),
  'type': getRandomArrayElement(TYPES_POINT)
});

export { generatePoint, generateDestination, generateOffersByType };

