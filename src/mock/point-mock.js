import { getRandomInt, getRandomArrayElement, createRandomDates } from '../utils';
import { DESTINATION_NAMES, OFFER_TITLES, TYPES_POINT, DESCRIPTIONS } from '../const';
import { nanoid } from 'nanoid';

const generatePhoto = () => ({
  'src': `http://picsum.photos/248/152?r=${getRandomInt(0, 10)}`,
  'description': getRandomArrayElement(DESCRIPTIONS)
});

const generateDestination = (id) => ({
  id,
  'description': getRandomArrayElement(DESCRIPTIONS),
  'name': DESTINATION_NAMES[id],
  'pictures': Array.from({length: getRandomInt(1,6)}, generatePhoto)
});

const getDestinations = () => Array.from({ length: DESTINATION_NAMES.length }).map((value, index) => generateDestination(index));

const generateOffer = (id) => ({
  id,
  'title': getRandomArrayElement(OFFER_TITLES),
  'price': getRandomInt(1, 200)
});

const generateOffersByType = (pointType) => ({
  type: pointType,
  offers: Array.from({ length: getRandomInt(1, 4) }).map((value, index) => generateOffer(index + 1, pointType)),
});

const getOffersByType = () => Array.from({ length: TYPES_POINT.length }).map((value, index) => generateOffersByType(TYPES_POINT[index]));

const generatePoint = () => {
  const offerIds = getRandomArrayElement(getOffersByType()).offers.map((offer) => offer.id);
  const randomDate = createRandomDates();
  return {
    'basePrice': getRandomInt(1, 1500),
    'dateFrom': randomDate.dateFrom,
    'dateTo': randomDate.dateTo,
    'id' : nanoid(),
    'destinationId': getRandomArrayElement(getDestinations()).id,
    'isFavorite': getRandomInt(1, 2) === 1,
    'offerIds':  Array.from({ length: getRandomInt(0, offerIds.length) }).map(() => offerIds[getRandomInt(0, offerIds.length - 1)]),
    'type': getRandomArrayElement(getOffersByType()).type
  };
};

const getPoints = () => Array.from({ length: 10 }).map(() => generatePoint()).sort();

export { getPoints, getDestinations, getOffersByType, generatePoint};

