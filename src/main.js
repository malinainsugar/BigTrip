import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model';
import { generateFilter } from './mock/processing.js';
import { getPoints, getOffersByType, getDestinations } from './mock/point-mock.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.trip-main');

const points = getPoints();
const offersByType = getOffersByType();
const destinations = getDestinations();

const pointsModel = new PointsModel();
pointsModel.init(points, destinations, offersByType);

const tripPresenter = new TripPresenter(siteMainElement.querySelector('.trip-events'), pointsModel);
tripPresenter.init();

const filters = generateFilter(pointsModel.points);

render(new FilterView(filters), siteHeaderElement.querySelector('.trip-controls__filters'));
