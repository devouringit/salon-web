/* eslint-disable no-case-declarations */
import { UPDATE_GENDER_STATUS, UPDATE_LOADER_STATUS, UPDATE_CURRENT_PAGE, UPDATE_PDP_ITEM } from '@constant/common';
import { setValueInCookies } from '@util/webstorage';

//this reducer will create new key inside redux store as function name and map this in reducers/index
export function gender(state: any = '', action) { // reduxState = {gender: action.payload}
    switch (action.type) {
        case UPDATE_GENDER_STATUS:
            // setValueInCookies('gdr', action.payload, action.expDays);
            return (action.payload);
        default:
            return state;
    }
}

export function currentPage(state: any = '', action) { // reduxState = {currentPage: action.payload}
    switch (action.type) {
        case UPDATE_CURRENT_PAGE:
            return (action.payload);
        default:
            return state;
    }
}

export function loader(state: any = '', action) {// reduxState = {loader: action.payload}
    switch (action.type) {
        case UPDATE_LOADER_STATUS:
            return (action.payload);
        default:
            return state;
    }
}

export function pdpItem(state: any = '', action) {// reduxState = {pdpItem: action.payload}
    switch (action.type) {
        case UPDATE_PDP_ITEM:
            return (action.payload);
        default:
            return state;
    }
}