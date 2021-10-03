import React from 'react'
import Custom404 from 'pages/404'
import Home from '@template/Home'
import { wrapper } from 'app/redux/store/store';
import { parseCookies } from '@util/utils';
import { DEFAULT_GENDER_TYPE } from '@constant/defaultValues';
import { updateGenderStatus, updateStore } from 'app/redux/actions';
import { getStoreConfigs, getStoreData } from '@storeData/store';
import { getMetaTagsData } from '@util/metaTagsService';
import HeadMeata from "@module/headMetaTags";
import Default from '@layout/Default';

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, req, res, query }) => {
    const storeState = store.getState();
    let metaTags: any = { title: '', description: '', image: '', siteName: '' }
    let storeData: any = null;
    const tenantQuery: any = query.tenant;
    let tenantId = tenantQuery.split('-');
    tenantId = tenantQuery[tenantQuery.length - 1];
    const storeQuery: any = query.store;
    const [storeName, storeId = ''] = storeQuery.split('-');
    const baseRouteUrl = `/${tenantQuery}/${storeQuery}/`; //current base url for routing
    const baseApiUrl = `/tenants/stores/tenantstorename/${tenantId}/${storeName}`; //current base url for routing
    // store.dispatch(updateStore(tenantStoreData));

    // get gender from client cookie start
    let genderFromCookie: any = parseCookies(req);
    genderFromCookie = (genderFromCookie && genderFromCookie.gdr) ? genderFromCookie.gdr : DEFAULT_GENDER_TYPE
    store.dispatch(updateGenderStatus(genderFromCookie));
    // get gender from client cookie end

    //get storedata from api start
    const configBaseApiUrl = `/tenant/${tenantId}/storename/${storeName}`
    if (storeState && !storeState?.storeData && !storeState?.storeData?.storeId) {
        await getStoreConfigs(configBaseApiUrl, baseApiUrl, genderFromCookie).then(async (response: any) => {
            if (response && response.storeData) {
                storeData = response.storeData;
                let { storeMetaData } = response;
                if (!storeMetaData) storeMetaData = {};
                storeData.configData = response.configData;
                const tenantStoreData = { storeMetaData, baseRouteUrl, storeData, validPagepath: false, validStore: true };
                metaTags = await getMetaTagsData(storeMetaData, storeData, query);
                if (metaTags && metaTags.title) {
                    tenantStoreData.validPagepath = true;
                }
                store.dispatch(updateStore({ ...tenantStoreData }));
            }
        }).catch((err) => {
            console.log(err)
        });
        const propsMetaTags = {
            title: metaTags.title || '',
            description: metaTags.description || '',
            image: metaTags.image || '',
            siteName: metaTags.siteName || '',
        }
        if (storeData) {
            return {
                props: { storeData, gender: genderFromCookie, metaTags: propsMetaTags },
            };
        } else {
            return {
                redirect: {
                    permanent: false,
                    destination: "/inactivestore"
                }
            }
        }
    }
    //get storedata from api end
})

function index({ metaTags }) {
    console.log('store page')
    return (
        <Default>
            <HeadMeata {...metaTags} />
            <Home />
        </Default>
    )
}

export default index
