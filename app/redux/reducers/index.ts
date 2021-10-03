import { combineReducers } from 'redux';
import { loader, gender, currentPage, pdpItem } from 'app/redux/reducers/common';
import { store } from 'app/redux/reducers/store';
import { alert } from 'app/redux/reducers/alert';
import { user } from 'app/redux/reducers/user';
import { order } from 'app/redux/reducers/order';

const rootReducer = combineReducers({
  store,
  gender,
  loader,
  alert,
  currentPage,
  pdpItem,
  user,
  order
});

export default rootReducer;
