import { render } from './framework/render.js';
import Filter from './view/filter';
import Trip from './presenter/trip';
import PointsModel from './model/points-model';
import { generateFilter } from './mock/processing.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPresenter = new Trip(tripContainer, pointsModel);

const filters = generateFilter(pointsModel.points);

render(new Filter(filters), filtersContainer);
tripPresenter.init(tripContainer, pointsModel);
