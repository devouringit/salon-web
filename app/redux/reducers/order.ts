/* eslint-disable no-case-declarations */
import { REPLACE_ORDER_ITEMS, SYNC_LOCAL_STORAGE_ORDER } from "@constant/order";
import { setValueInLocalStorage, getValueFromLocalStorage } from "@util/webstorage";

const initialState = {
    items: []
}
export function order(state = initialState, action) {
    switch (action.type) {
        case REPLACE_ORDER_ITEMS:
            const oldState = state;
            const updatedState = { ...oldState, items: action.payload }
            setValueInLocalStorage('order', updatedState);
            return updatedState;
        case SYNC_LOCAL_STORAGE_ORDER:
            const persistedOrder: any = getValueFromLocalStorage('order');
            return persistedOrder || initialState;
        default:
            return state;
    }
}