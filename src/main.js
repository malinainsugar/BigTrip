import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';
import SiteMenuView from './view/site-menu-view.js';

const AUTHORIZATION = 'Basic fgjf4935gds';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const tripContainer = document.querySelector('.trip-events');
const menuContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const navigationContainer = document.querySelector('.trip-controls__navigation');

const pointsModel = new PointsModel(pointsApiService);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filtersContainer: filtersContainer,
  pointsModel: pointsModel,
  filterModel: filterModel,
});

const tripPresenter = new TripPresenter({
  tripContainer: tripContainer,
  menuContainer: menuContainer,
  pointsModel: pointsModel,
  filterModel: filterModel,
});

render(new SiteMenuView(), navigationContainer);

pointsModel.init();
tripPresenter.init();
filterPresenter.init();

