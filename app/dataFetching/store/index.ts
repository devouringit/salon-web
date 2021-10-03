import localData from "@constant/dummy";
import { prepareStoreData } from "@util/dataFilterService";
import { APISERVICE } from "@api/RestClient";

export const getStoreData = (gender, baseApiUrl) => {
    return new Promise((res, rej) => {
        // enable for server data
        const response = {
            storeData: null,
            storeMetaData: null
        }
        APISERVICE.GET(`${process.env.BASE_PCS_URL}${baseApiUrl}`)  //get store details
            .then(async (tenantResponse) => {
                if (tenantResponse.status == 200) {
                    response.storeMetaData = tenantResponse.data;

                    if (response.storeMetaData && response.storeMetaData.active && !response.storeMetaData.terminate) {
                        await APISERVICE.GET(`${process.env.GET_STORE_BY_STORE_ID}/${response.storeMetaData.id}`) // get store data
                            .then((storeResponse) => {
                                if (storeResponse.status == 200) {

                                    if (storeResponse.data && storeResponse.data.active) {
                                        prepareStoreData(storeResponse.data, gender).then((filteredResponse) => {
                                            response.storeData = filteredResponse;
                                            res(response);
                                        })
                                    } else {
                                        rej({ err: 'Inactive Store' });
                                    }
                                } else if (storeResponse.status == 401) {
                                    rej({ error: 'Session expired, re login into the system.', status: storeResponse.status });
                                    console.log('Session expired, re login into the system.');
                                }
                            }).catch(function (error) {
                                rej(error);
                                console.log("error", error);
                            });
                    } else {
                        rej({ err: 'Inactive Store' });
                    }
                } else if (tenantResponse.status == 401) {
                    rej({ error: 'Session expired, re login into the system.', status: tenantResponse.status });
                    console.log('Session expired, re login into the system.');
                }
            }).catch(function (error) {
                rej(error);
                console.log("error", error);
            });


        //enable for local data

        // if (localData.active) {
        //     prepareStoreData(localData, gender).then((localResponse) => {
        //         response.storeData = localResponse;
        //         res({ storeData: localResponse });
        //     }).catch(function (error) {
        //         rej(error);
        //         console.log("error", error);
        //     });
        // } else {
        //     rej({ err: 'Inactive Store' });
        // }
    })
};

export const getStoreConfigs = (configBaseApiUrl, baseApiUrl, genderFromCookie) => {
    return new Promise((res, rej) => {
        APISERVICE.GET(`${process.env.BASE_STORE_CONFIGS_URL}${configBaseApiUrl}`)  //get store details
            .then(async (configResponse) => {
                if (configResponse.status == 200) {
                    const configData = configResponse.data;
                    if (configData) {
                        //sort by index
                        if (configData.feedbackConfig && configData.feedbackConfig.typeList) {
                            configData.feedbackConfig.typeList = configData.feedbackConfig.typeList.sort((a, b) => (a.index > b.index) ? 1 : -1)
                            configData.feedbackConfig.typeList.map((config) => {
                                config.typeOptions = config.typeOptions.sort((a, b) => (a.index > b.index) ? 1 : -1)
                            })
                        }
                        //sort by index
                        getStoreData(genderFromCookie, baseApiUrl).then((response: any) => {
                            const resObj = {
                                ...response,
                                configData,
                            }
                            res(resObj)
                        }).catch(function (error) {
                            rej(error);
                            console.log("error", error);
                        });
                    } else {
                        rej({ err: 'Invalid Link' });
                    }
                } else if (configResponse.status == 401) {
                    rej({ error: 'Session expired, re login into the system.', status: configResponse.status });
                    console.log('Session expired, re login into the system.');
                }
            }).catch(function (error) {
                rej(error);
                console.log("error", error);
            });
    })
};

export const sessionLogin = () => {
    return new Promise((res, rej) => {
        APISERVICE.POST(`${process.env.BASE_PCS_URL}/svlogin`, {}).then((response) => {
            res(response);
            // console.log("response", response);
        }).catch(function (error) {
            rej(error);
            console.log("error", error);
        });
    })
}