/* eslint-disable no-unused-vars */
import { FILTER_TYPE, SORT_TYPE } from '../const';
import dayjs from 'dayjs';

const isPast = (pointDate) => dayjs(pointDate.dateFrom).isBefore(dayjs());
const isFuture = (pointDate) => dayjs(pointDate.dateTo).isAfter(dayjs());

const filters = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isFuture(point)),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPast(point))
};

const getDifference = (oneDate, secondDate, param) => dayjs(secondDate).diff(oneDate, param);

const sorting = {
  [SORT_TYPE.DAY]: (points) => points.sort((prev,next) => getDifference(next.dateFrom, prev.dateFrom, '')),
  [SORT_TYPE.EVENT]: (points) => null,
  [SORT_TYPE.TIME]: (points) => points.sort((prev, next) => getDifference(prev.dateFrom, prev.dateTo, 'minute') - getDifference(next.dateFrom, next.dateTo, 'minute')),
  [SORT_TYPE.PRICE]: (points) => points.sort((prev, next) => prev.basePrice - next.basePrice),
  [SORT_TYPE.OFFERS]: (points) => null
};

const generateFilter = (points) => Object.entries(filters).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }),
);

const generateSorting = (points) => Object.entries(sorting).map(
  ([sortedName, sortedPoints]) => ({
    name: sortedName,
    sequence: sortedPoints(points),
  }),
);

export { generateFilter, generateSorting };

