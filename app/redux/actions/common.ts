import { UPDATE_GENDER_STATUS, UPDATE_LOADER_STATUS, UPDATE_CURRENT_PAGE, UPDATE_PDP_ITEM } from "@constant/common";

export const updateGenderStatus = (payload) => {
    return { type: UPDATE_GENDER_STATUS, payload };
}

export const updateCurrentPage = (payload) => {
    return { type: UPDATE_CURRENT_PAGE, payload };
}

export const updatePdpItem = (payload) => {
    return { type: UPDATE_PDP_ITEM, payload };
}

export const enableLoader = (payload = true) => {
    return { type: UPDATE_LOADER_STATUS, payload };
}

export const disableLoader = (payload = false) => {
    return { type: UPDATE_LOADER_STATUS, payload };
}