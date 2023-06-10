import { FilterType, SortType } from './const';
import dayjs from 'dayjs';

const isPast = (point) => dayjs().diff(point.dateTo, 'minute') > 0;
const isFuture = (point) => dayjs().diff(point.dateFrom, 'minute') <= 0;

const filtrate = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point))
};

const generateFilter = (points) => Object.entries(filtrate).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }),
);

const getDifference = (oneDate, secondDate) => dayjs(secondDate).diff(oneDate);

const sorting = {
  [SortType.DAY]: (points) => points.sort((pointA, pointB) => getDifference(pointB.dateFrom, pointA.dateFrom)),
  [SortType.TIME]: (points) => points.sort((pointA, pointB) => getDifference(pointA.dateFrom, pointA.dateTo) - getDifference(pointB.dateFrom, pointB.dateTo, 'second')),
  [SortType.PRICE]: (points) => points.sort((pointA, pointB) => pointA.basePrice - pointB.basePrice)
};

export { generateFilter, filtrate, sorting };

