import { render } from './framework/render.js';
import Filter from './view/filter';
import Trip from './presenter/trip';
import PointsModel from './model/points-model';

const filtersContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPresenter = new Trip(tripContainer, pointsModel);

render(new Filter(), filtersContainer);
tripPresenter.init(tripContainer, pointsModel);
