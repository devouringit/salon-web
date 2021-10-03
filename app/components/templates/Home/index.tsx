/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import { SQUARE_GRID, CIRCULAR_GRID, HORIZONTAL_SQUARE, LARGE_BANNER, SAMLL_BANNER } from "@constant/layout";
import { BANNER_NO_IMAGE, SMALL_SLIDER_NO_IMAGE, LARGE_SLIDER_NO_IMAGE, SKILLED_STAFF_NO_IMAGE } from '@constant/noImage';
import ImageSlider from "@element/imageSlider";
import CircularGrid from "@module/circularGrid";
import SquareGrid from "@module/squareGrid";
import { makeStyles } from "@material-ui/core/styles";
import HorizontalSquareGrid from '@module/horizontalSquareGrid';
import { connect } from 'react-redux';
import Button from "@material-ui/core/Button";
import { useDispatch } from 'react-redux';
import { updateStoreData, updateGenderStatus, showSuccess, updateStore } from "app/redux/actions";
import { prepareStoreData } from "@util/dataFilterService";
import { useSelector } from 'react-redux';
import { useCookies } from "react-cookie";
import ProductsWithCategory from '@module/productsWithCategory';
import { PRODUCT } from '@constant/types';


function HomePage({ storeData, gender }) {
  const [cookie, setCookie] = useCookies(["gdr"])
  const dispatch = useDispatch();
  // const gender = useSelector(state => state.gender);
  const availableGenders = storeData?.configData?.genderConfig?.split(',');
  const onClickCategory = (cat) => {
    // console.log(cat)
  }
  const [isAnyProductAvailable, setIsAnyProductAvailable] = useState(false);
  const [smallBanners, setSmallBanners] = useState<any>();

  useEffect(() => {
    if (storeData && storeData.categories) {
      if (storeData.categories) {
        const isAnyProductAvl: any[] = storeData.categories.filter((data) => data.type == PRODUCT);
        if (isAnyProductAvl.length != 0) setIsAnyProductAvailable(true);
      }
      if (storeData.curatedGroups) {
        const smallBannerGroup: any[] = storeData.curatedGroups.filter((curetedGroup) => curetedGroup.curatedLayout == SAMLL_BANNER && curetedGroup.type == PRODUCT && curetedGroup.showOnUi);
        if (smallBannerGroup.length != 0) setSmallBanners(smallBannerGroup[0]);
      }
    }
  }, [storeData]);

  useEffect(() => {
    if (availableGenders.length === 1 && gender !== availableGenders[0].toLowerCase()) {
      updateGenderStatus(availableGenders[0].toLowerCase());
      setCookie("gdr", availableGenders[0].toLowerCase(), {
        path: "/",
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires after 1hr
        sameSite: true,
      })
    }
  }, [availableGenders])

  useEffect(() => {

    //theme changes effect
    document.body.dataset.theme = gender;
    document.body.style.backgroundImage = `url("/assets/images/${gender}/bg.png")`

    if (availableGenders.length === 1 && gender !== availableGenders[0].toLowerCase()) {
      const currentGender = availableGenders[0].toLowerCase();
      updateGenderStatus(currentGender);
      setCookie("gdr", currentGender, {
        path: "/",
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires after 1hr
        sameSite: true,
      })
      if (storeData && storeData.storeId && currentGender) {
        if (storeData.categories) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          prepareStoreData(storeData, currentGender).then((response: {}) => {
            setTimeout(() => {
              dispatch(updateStoreData({ ...response }));
            }, 100);
          })
        }
      }
    } else {
      if (storeData && storeData.storeId && gender) {
        if (storeData.categories) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          prepareStoreData(storeData, gender).then((response: {}) => {
            setTimeout(() => {
              dispatch(updateStoreData({ ...response }));
            }, 100);
          })
        }
      }
    }
  }, [gender])

  const handleListItemClick = (value) => {
    dispatch(updateGenderStatus(value));
    dispatch(showSuccess('Gender Filter changed successfully'))
    setCookie("gdr", value, {
      path: "/",
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires after 1hr
      sameSite: true,
    })
  };

  return (
    <>
      <div className="homepageContainer">
        {storeData && storeData.curatedGroups ? <div className="fullwidth">
          {storeData.sliders?.length != 0 && <div className="herobanner">
            <ImageSlider itemsList={storeData.sliders} config={{}} no_image={BANNER_NO_IMAGE} />
          </div>}
          {availableGenders?.includes('male') && availableGenders?.includes('female') &&
            <div className={gender === 'male' ? 'malebg' : 'femalebg'}>
              {availableGenders?.includes('female') && <div className="selmalefemale">
                <Button onClick={() => handleListItemClick('female')}>
                  <img src={gender === 'female' ? "/assets/Icons/women_sel.png" : "/assets/Icons/women.png"} />
                </Button>
              </div>}
              {availableGenders?.includes('male') && <div className="selmalefemale" >
                <Button onClick={() => handleListItemClick('male')}>
                  <img src={gender === 'male' ? "/assets/Icons/men_sel.png" : "/assets/Icons/men.png"} />
                </Button>
              </div>}
            </div>
          }
          {/* <div className="common-grey-boder"></div> */}
          {storeData.curatedGroups?.map((curetedGroup, index) => {
            return <div className="fullwidth" key={index}>
              {curetedGroup.showOnUi && curetedGroup.curatedCategories.length != 0 && <>
                {curetedGroup.name && (curetedGroup.curatedLayout == SAMLL_BANNER ? curetedGroup.type != PRODUCT : true) && <div className="common-section-title common-lr-padd">{curetedGroup.name}</div>}
                {curetedGroup.curatedLayout == CIRCULAR_GRID &&
                  <>
                    <div className="roundthreelayout">
                      <CircularGrid items={curetedGroup.curatedCategories} config={{}} handleClick={(category) => onClickCategory(category)} />
                    </div>
                  </>
                }
                {curetedGroup.curatedLayout == SAMLL_BANNER && curetedGroup.type != PRODUCT &&
                  <>
                    <div className="common-grey-boder"></div>
                    <div className="midbanner">
                      <ImageSlider itemsList={curetedGroup.curatedCategories} config={{ redirection: true }} no_image={SMALL_SLIDER_NO_IMAGE} />
                    </div>
                    <div className="common-grey-boder"></div>
                  </>
                }
                {curetedGroup.curatedLayout == HORIZONTAL_SQUARE &&
                  <>
                    <div className="skilledsection">
                      <HorizontalSquareGrid items={curetedGroup.curatedCategories} config={{}} />
                    </div>
                    <div className="common-grey-boder"></div>
                  </>
                }
                {curetedGroup.curatedLayout == LARGE_BANNER &&
                  <>
                    <div className="common-grey-boder"></div>
                    <div className="packageoffer">
                      <ImageSlider itemsList={curetedGroup.curatedCategories} config={{ redirection: true }} no_image={LARGE_SLIDER_NO_IMAGE} />
                    </div>
                    <div className="common-grey-boder"></div>
                    <div className="common-10height"></div>
                  </>
                }
                {curetedGroup.curatedLayout == SQUARE_GRID &&
                  <>
                    <div className="boxlayout">
                      <SquareGrid items={curetedGroup.curatedCategories} config={{ redirection: true, withShadow: true }} handleClick={() => { }} noImage={SKILLED_STAFF_NO_IMAGE} />
                    </div>
                  </>
                }
                {/* <div className="common-10height"></div> */}
              </>}
            </div>
          })}
          {storeData.categories &&
            <>
              <div className="fullwidth">
                <div className="common-section-title common-lr-padd">Our Services</div>
                <div className="boxlayout">
                  <SquareGrid items={storeData.categories} config={{ redirection: true, withShadow: true, from: 'all', type: 'service' }} handleClick={() => { }} noImage={SKILLED_STAFF_NO_IMAGE} />
                </div>
              </div>

              {smallBanners &&
                <>
                  <div className="common-section-title common-lr-padd">{smallBanners.name}</div>
                  <div className="common-grey-boder"></div>
                  <div className="midbanner">
                    <ImageSlider itemsList={smallBanners.curatedCategories} config={{ redirection: true }} no_image={LARGE_SLIDER_NO_IMAGE} />
                  </div>
                  <div className="common-grey-boder"></div>
                </>
              }

              {isAnyProductAvailable && <div className="fullwidth">
                {/* <div className="common-section-title common-lr-padd">Our Products</div> */}
                <div className="boxlayout" id="product-list-wrap">
                  {/* <SquareGrid items={storeData.categories} config={{ redirection: false, withShadow: true, from: 'all', type: PRODUCT }} handleClick={(category) => scrollToCategory(category)} noImage={SKILLED_STAFF_NO_IMAGE} /> */}
                  <ProductsWithCategory categories={storeData.categories} />
                </div>
              </div>}
            </>
          }
        </div> :
          <div className="fullwidth">

          </div>}
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    storeData: state?.store?.storeData,
    gender: state?.gender
  }
}

export default connect(mapStateToProps)(HomePage);
