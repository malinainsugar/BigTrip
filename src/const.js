const TYPES_POINT = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATION_NAMES = [
  'Saint Petersburg',
  'Moscow',
  'Shanghai',
  'Beijing',
  'Kyoto',
  'Seoul',
  'New York',
  'Tokyo',
  'Bangkok',
  'Phuket',
  'Los Angeles'
];

const DESCRIPTIONS = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  .split('. ');

const OFFER_TITLES = [
  'Add a child safety seat',
  'Stay overnight',
  'Add lunch',
  'Rent a polaroid',
  'Add a place for a pet',
  'Book a window seat',
  'Book a place in the recreation area',
  'Use the translator service',
  'Upgrade to a business class'
];

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const SORT_TYPE = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export {TYPES_POINT, DESTINATION_NAMES, DESCRIPTIONS, OFFER_TITLES, FILTER_TYPE, SORT_TYPE};

