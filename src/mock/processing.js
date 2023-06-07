import { FILTER_TYPE } from '../const';
import dayjs from 'dayjs';

const isPast = (pointDate) => dayjs(pointDate.dateFrom).isBefore(dayjs());
const isFuture = (pointDate) => dayjs(pointDate.dateTo).isAfter(dayjs());

const filters = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isFuture(point)),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPast(point))
};

const generateFilter = (points) => Object.entries(filters).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }),
);

export { generateFilter };

