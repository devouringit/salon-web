import Default from '@layout/Default';
import CategoryPage from '@template/categories/categories';
// import CategoryPage from '@template/categories/verticalCategoryPage';
import { useRouter } from 'next/router';
import PdpPage from "@module/pdp/pdp";
import React, { useEffect, useState } from "react";
import { wrapper } from 'app/redux/store/store'
import { updateStore } from "app/redux/actions/store";
import { updateGenderStatus, updateCurrentPage } from "app/redux/actions/common";
import { getStoreData, getStoreConfigs } from '@storeData/store';
import { parseCookies } from "@util/utils";
import AllCategoryPage from '@template/categories/allCategories';
import { DEFAULT_GENDER_TYPE } from "@constant/defaultValues";
import { getMetaTagsData } from '@util/metaTagsService';
import HeadMeata from "@module/headMetaTags";
import Home from '@template/Home';
import { useSelector, useDispatch, connect } from 'react-redux';
import CartPage from '@template/cartPage';
import { syncLocalStorageOrder } from "app/redux/actions/order";
import { windowRef } from "@util/window";
import { updateUserData } from 'app/redux/actions/user';
import { useCookies } from "react-cookie";
import FeedbackPage from '@template/feedback';
import OrderConfirmation from '@template/orderConfirmation';
import { showError } from '@context/actions';
import Privacy from '@template/privacy';
import CheckoutPage from '@template/checkout';

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, req, res, query }) => {
  debugger
  const storeState = store.getState();
  let metaTags: any = null;
  let storeData: any = null;
  const tenantQuery: any = query.tenant;
  let tenantId = tenantQuery.split('-');
  tenantId = tenantQuery[tenantQuery.length - 1];
  const storeQuery: any = query.store;
  const [storeName, storeId = ''] = storeQuery.split('-');
  const baseRouteUrl = `/${tenantQuery}/${storeQuery}/`; //current base url for routing
  const baseApiUrl = `/tenants/stores/tenantstorename/${tenantId}/${storeName}`; //current base url for routing

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
        if (query.pagepath && query.pagepath.length != 0 && !query.pagepath.includes('feedback')) {
          metaTags = await getMetaTagsData(storeMetaData, storeData, query);
        }
        if (metaTags && metaTags.title) {
          tenantStoreData.validPagepath = true;
        }
        store.dispatch(updateStore({ ...tenantStoreData }));
      }
    }).catch((err) => {
      console.log(err)
    });

    const propsMetaTags = {
      title: metaTags?.title || '',
      description: metaTags?.description || '',
      image: metaTags?.image || '',
      siteName: metaTags?.siteName || '',
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

const PagePath = ({ storeData, gender, metaTags, store }) => {
  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies();
  const [url_Segment, setUrl_Segment] = useState(null);
  const router = useRouter();
  const [currentPage, setcurrentPage] = useState(null);
  const [currentCategoryType, setCurrentCategoryType] = useState(null);
  const validPagepath = useSelector(state => state.store.validPagepath);
  const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
  const [enableDefaultLayout, setEnableDefaultLayout] = useState(true);//if you dont need default header navigation layout then set enableDefaultLayout to false (refer feedback page case)

  useEffect(() => {
    //detect route change
    if (storeData && storeData.storeId) {
      let current_page_url: any = router.query.pagepath[0];  //single folder routing
      if (router.query.pagepath?.length) current_page_url = storeData.appointmentId ? router.query.pagepath[0] : router.query.pagepath[router.query.pagepath.length - 1];//if appointmentid present then page is feedback
      if (current_page_url.includes('-grp') || current_page_url.includes('home')) {
        setcurrentPage('home');
      } else if (current_page_url.includes('-pdp')) {
        current_page_url = current_page_url.split('-pdp')[0];
        setcurrentPage('pdp');
      } else if (current_page_url.includes('-prp')) {
        current_page_url = current_page_url.split('-prp')[0];
        setcurrentPage('all-Categories');
        setCurrentCategoryType('product');
      } else if (current_page_url.includes('-srp')) {
        current_page_url = current_page_url.split('-srp')[0];
        setCurrentCategoryType('service');
        setcurrentPage('all-Categories');
      } else if (current_page_url.includes('cart')) {
        current_page_url = current_page_url.split('-srp')[0];
        setcurrentPage('cart');
      } else if (current_page_url.includes('checkout')) {
        setcurrentPage('checkout');
      } else if (current_page_url.includes('orderconfirmation')) {
        if (router.query.status !== 'paid') {
          dispatch(showError('Your payment has been failed.', 5000));
          setcurrentPage('cart');
        } else {
          setcurrentPage('orderconfirmation');
        }
      } else if (current_page_url.includes('feedback')) {
        setEnableDefaultLayout(false);
        setcurrentPage('feedback');
      } else if (current_page_url.includes('privacy')) {
        setcurrentPage('privacy');
      } else {
        setcurrentPage('category');
      }
      current_page_url = current_page_url.split("-").join(" ");
      setUrl_Segment(current_page_url);
    }
  }, [router.asPath]);

  useEffect(() => {
    dispatch(updateCurrentPage(currentPage));
  }, [currentPage])

  useEffect(() => {
    if (windowRef) {
      dispatch(syncLocalStorageOrder());
    }
  }, [windowRef])

  useEffect(() => {
    if (cookie['user']) {
      dispatch(updateUserData(cookie['user']));
    }
  }, [cookie])

  return <>
    <HeadMeata {...metaTags} />
    {enableDefaultLayout ? <Default>
      {(storeData && storeData?.storeId) && url_Segment &&
        currentPage == 'home' ? <Home />
        :
        currentPage === 'category' ? <CategoryPage metaTags={metaTags} url_Segment={url_Segment} storeData={storeData} gender={gender} />
          :
          currentPage === 'pdp' && storeData?.itemsList ? <PdpPage url_Segment={url_Segment} metaTags={metaTags} storeData={storeData} gender={gender} />
            :
            currentPage === 'all-Categories' && storeData?.itemsList ? <AllCategoryPage metaTags={metaTags} url_Segment={url_Segment} storeData={storeData} gender={gender} type={currentCategoryType} />
              :
              currentPage == 'cart' ? <CartPage />
                :
                currentPage == 'checkout' ? <CheckoutPage />
                  :
                  currentPage == 'orderconfirmation' ? <OrderConfirmation />
                    :
                    currentPage == 'privacy' ? <Privacy />
                      :
                      null

      }
    </Default>
      :
      currentPage == 'feedback' ? <FeedbackPage storeData={storeData} metaTags={metaTags} />
        : null
    }
  </>
}
const mapStateToProps = (state) => {
  return {
    gender: state.gender,
    store: state?.store,
    storeData: state?.store?.storeData
  }
}
export default connect(mapStateToProps)(PagePath);