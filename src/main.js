import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './api-services/points-api-service.js';

const AUTHORIZATION = 'Basic 48gh589hfdg49grr';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const mainElement = document.querySelector('.page-main');
const menuContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
pointsModel.init();

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(menuContainer.querySelector('.trip-controls__filters'), filterModel, pointsModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(mainElement.querySelector('.trip-events'), pointsModel, filterModel);
tripPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const newPointFormCloseHandle = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(newPointFormCloseHandle);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, menuContainer);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
