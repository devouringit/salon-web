import React, { useState, useEffect, useRef } from 'react';
// for Accordion starts
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// for Accordion ends
import ScrollingNavigation from '@module/topScrolleingNavigation';
import SquareGrid from "@module/squareGrid";
import VerticalListing from "@module/verticalListing";
import { SUB_CAT_NO_IMAGE } from "@constant/noImage";
import { useRouter } from 'next/router';
import Item from "@element/horizontalItem";
import HeadMetaTags from "@module/headMetaTags";
import ImageGallery from 'react-image-gallery';
import { getItemMetaTags } from '@util/metaTagsService';
import { useSelector } from 'react-redux';

function CategoryPage({ url_Segment, storeData, gender, metaTags }) {

  const router = useRouter()
  const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
  const itemsList = useSelector(state => state.store.storeData.itemsList);
  const [activeGroup, setActiveGroup] = useState(null)
  const [activeCuratedCategory, setActiveCuratedCategory] = useState(null)
  const [mappedCategories, setMappedCategories] = useState(null);
  const [itemsWithoutCategoryList, setItemsWithoutCategoryList] = useState([]);
  const [baseSubCategories, setBaseSubCategories] = useState(null);
  const [categoriesWithItems, setCategoriesWithItems] = useState(null);
  const [categoriesPromotionBanner, setCategoriesPromotionBanner] = useState(null);
  const [subCuratedCategories, setSubCuratedCategories] = useState(null);
  const [activeBaseCategory, setActiveBaseCategory] = useState(null);
  const [activeSubCuratedCategory, setActiveSubCuratedCategory] = useState(null);
  const [curatedItemsList, setCuratedItemsList] = useState(null);
  const [activeMmetaTags, setmetaTags] = useState(metaTags);
  const [accordianExpanded, setAccordianExpanded] = useState(true);
  const { configData } = useSelector(state => state.store ? state.store.storeData : null);

  const settings = {
    showThumbnails: false,
    showPlayButton: false,
    showBullets: (categoriesPromotionBanner && categoriesPromotionBanner?.length) > 1 ? true : false,
    autoPlay: true,
    slideDuration: 800,
    slideInterval: 3000,
    startIndex: 0,
    showNav: false,
    showFullscreenButton: false
  }

  const getCategoryData = () => {
    let categoryDataFromUrl = null;
    let categoryGroupDataFromUrl = null;
    storeData?.curatedGroups?.map((groupData, groupDataIndex) => {
      if (!categoryDataFromUrl) {
        groupData?.curatedCategories?.map((categoryData) => {
          if (!categoryDataFromUrl) {
            if (categoryData.name.toLowerCase() == url_Segment) {
              categoryData.showOnUi && (categoryData.isSelected = true);
              categoryGroupDataFromUrl = groupData;
              categoryDataFromUrl = categoryData;
            }
          }
        })
      }
      if (groupDataIndex == storeData.curatedGroups?.length - 1) {
        if (categoryDataFromUrl && categoryDataFromUrl.showOnUi) {
          categoryGroupDataFromUrl?.curatedCategories?.map((data) => (data.name == categoryDataFromUrl.name) && (data.isSelected = true));
          setActiveCuratedCategory(categoryDataFromUrl);
          setActiveGroup({ ...categoryGroupDataFromUrl });
        } else {
          // active category not found by url name
          // console.log('category not found');
          if (categoryGroupDataFromUrl) {
            const avlActiveCat = categoryGroupDataFromUrl.curatedCategories?.filter((cat) => cat.showOnUi);
            if (avlActiveCat?.length != 0) {
              // console.log('first category set');
              categoryGroupDataFromUrl?.curatedCategories?.map((data) => (data.name == avlActiveCat[0].name) && (data.isSelected = true));
              setActiveCuratedCategory(avlActiveCat[0]);
              setActiveGroup({ ...categoryGroupDataFromUrl });
            }
            // else router.push('/');
          }
          else router.push(baseRouteUrl + '/');
        }
      }
    })
  }

  useEffect(() => {
    const element = document.getElementById('scrolling-div');
    window.scrollTo(0, element?.offsetTop);
  }, [categoriesPromotionBanner])

  useEffect(() => {
    getCategoryData();
  }, [url_Segment, gender, storeData, itemsList])

  useEffect(() => {
    if (activeCuratedCategory && activeCuratedCategory.name) {
      setmetaTags(getItemMetaTags(activeCuratedCategory));
      if (activeCuratedCategory.entityType === 'category') {
        setMappedCategories(null);
        setItemsWithoutCategoryList([]);
        setCategoriesPromotionBanner(null);
        setCategoriesWithItems(null);
        setSubCuratedCategories(null);
        setActiveBaseCategory(null);
        setActiveSubCuratedCategory(null);
        const mappedCategories = activeCuratedCategory.curatedItems;
        mappedCategories?.map((mappedCategory) => {
          storeData?.categories?.map((storeCategory) => {
            if (storeCategory.name === mappedCategory.name) {
              mappedCategory.categoryDetails = storeCategory;
            } else {
              if (storeCategory.hasSubcategory && storeCategory.categoryList.length != 0) {
                storeCategory.categoryList?.map((subCategory) => {
                  if (subCategory.name === mappedCategory.name) {
                    mappedCategory.categoryDetails = subCategory;
                  } else {
                    if (subCategory.hasSubcategory && subCategory.categoryList.length != 0) {
                      subCategory.categoryList?.map((subSubCategory) => {
                        if (subSubCategory.name === mappedCategory.name) {
                          mappedCategory.categoryDetails = subSubCategory;
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        })
        setTimeout(() => {
          const categoryList = [];
          mappedCategories?.map((catData) => {
            const category = { ...catData.categoryDetails, ...catData };
            delete category.categoryDetails;
            categoryList.push(category);
          })
          setMappedCategories(categoryList);
        }, 100);
      } else if (activeCuratedCategory.entityType === 'items') {
        if (activeCuratedCategory.curatedItems.length !== 0) {
          let itemsList = activeCuratedCategory.curatedItems;
          const categoriesPromotionBannerArray = [];
          itemsList.map((item, index) => {
            let itemDetails = storeData.itemsList.filter(data => data.name == item.name);
            itemDetails[0].length != 0 && (item = { ...item, ...itemDetails[0] })
            item?.imagePaths?.map((imagObj) => {
              imagObj.imagePath && categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
            })
            if (index == itemsList.length - 1) {
              setCategoriesPromotionBanner(categoriesPromotionBannerArray);
              setCuratedItemsList(itemsList);
            }
          })
        }
      }
    }
  }, [activeCuratedCategory])

  useEffect(() => {
    if (mappedCategories && mappedCategories?.length == 1) {
      prepareActiveCategoryData(mappedCategories[0], 'Base', 'first-load');
    } else {
      setSubCuratedCategories(mappedCategories);
    }
  }, [mappedCategories]);

  const getPromotionalBanner = (category) => {
    const categoriesPromotionBannerArray = [];
    let imagePathsArray = [];

    if (category && category.imagePaths && category.imagePaths != null && category.imagePaths.length != 0) {
      imagePathsArray = [...imagePathsArray, ...category.imagePaths];
    }
    if (category && category.hasSubcategory && category.categoryList.length != 0) {
      category.categoryList?.map((catData, catIndex) => {
        catData.imagePaths = (catData && catData.imagePaths && catData.imagePaths != null && catData.imagePaths.length != 0) ? catData.imagePaths : []
        imagePathsArray = [...imagePathsArray, ...catData.imagePaths];
        if (catIndex == category.categoryList?.length - 1) {
          imagePathsArray?.map((imagObj) => {
            imagObj.imagePath && categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
          })
        }
      })
    }
    if (category && category.itemList) {
      category.itemList?.map((itemData, catIndex) => {
        imagePathsArray = [...imagePathsArray, ...itemData.imagePaths];
        if (catIndex == category.itemList?.length - 1) {
          imagePathsArray?.map((imagObj) => {
            imagObj.imagePath && categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
          })
        }
      })
    }
    setCategoriesPromotionBanner(categoriesPromotionBannerArray);
  }

  const prepareActiveCategoryData = (category, from, status = null) => {
    setAccordianExpanded(false);
    setCategoriesWithItems(null);
    if (category.hasSubcategory && category.categoryList.length != 0) {
      const isAnySubSubCategoryAvl = category.categoryList?.filter((catData) => catData.hasSubcategory);
      if (isAnySubSubCategoryAvl?.length) {
        setBaseSubCategories(category.categoryList);
        setItemsWithoutCategoryList([]);
        setCategoriesPromotionBanner(null);
        // setCategoriesWithItems(null);
      } else {
        setItemsWithoutCategoryList([]);
        getPromotionalBanner(category);
        setCategoriesWithItems(category.categoryList);
      }
    } else {
      //direct items list
      if (from === 'Curated') {
        setBaseSubCategories(null);
        setActiveBaseCategory(null);
      }
      if (category.itemList) {
        getPromotionalBanner(category);
      }
      setItemsWithoutCategoryList(category.itemList || []);
    }
    if (from === 'Curated') {
      setActiveSubCuratedCategory(category);
      subCuratedCategories && subCuratedCategories?.map((cat) => {
        if (cat.name === category.name) cat.isSelected = true;
        else cat.isSelected = false;
      })
      baseSubCategories && baseSubCategories?.map((cat) => cat.isSelected = false)
    } else {
      status !== 'first-load' && setActiveBaseCategory(category);
      baseSubCategories && baseSubCategories?.map((cat) => {
        if (cat.name === category.name) cat.isSelected = true;
        else cat.isSelected = false;
      })
    }
  }

  return (
    <>
      {activeGroup ? <div className="categorypageContainer">
        <HeadMetaTags title={activeMmetaTags.title} siteName={activeMmetaTags.siteName} description={activeMmetaTags.description} image={activeMmetaTags.image} />
        <ScrollingNavigation items={activeGroup.curatedCategories} config={{}} handleClick={(item) => setActiveCuratedCategory(item)} activeCategory={activeCuratedCategory} />
        {activeCuratedCategory?.entityType === 'category' && <div className="content-wrap clearfix">
          <>
            {subCuratedCategories && <div className="fullwidth">
              {activeSubCuratedCategory ?
                <Accordion expanded={accordianExpanded} onChange={() => setAccordianExpanded(accordianExpanded ? false : true)}>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div className="accor-title">{activeSubCuratedCategory.name}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="boxlayout">
                      <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={subCuratedCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Curated')} />
                    </div>
                  </AccordionDetails>
                </Accordion> :
                <div className="subcat-cover clearfix">
                  <div className="boxlayout">
                    <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={subCuratedCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Curated')} />
                  </div>
                </div>
              }
            </div>}
          </>

          <>
            {(subCuratedCategories ? activeSubCuratedCategory : true && baseSubCategories) && <div className="fullwidth">
              {activeBaseCategory ?
                <Accordion expanded={accordianExpanded} onChange={() => setAccordianExpanded(accordianExpanded ? false : true)}>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div className="accor-title">{activeBaseCategory.name}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="boxlayout">
                      <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={baseSubCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Base')} />
                    </div>
                  </AccordionDetails>
                </Accordion> : <>

                  {baseSubCategories ? <div className="subcat-cover clearfix">
                    <div className="boxlayout">
                      <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={baseSubCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Base')} />
                    </div>
                  </div> : null}
                </>
              }
            </div>}
          </>
          {/* <div id="scrolling-div" className="scrolling-div"></div> */}
          {/* categoriesPromotionBanner */}
          {categoriesPromotionBanner &&
            <div className="promotional-banner" id="promotional-banner">
              <ImageGallery items={categoriesPromotionBanner} {...settings} />
            </div>}
          {/* categoriesWithItems */}
          <div className="category-with-item">
            {categoriesWithItems &&
              categoriesWithItems?.map((category, catIndex) => {
                return <div key={catIndex}>
                  {category.showOnUi && category.active ? <>
                    {<div className="service-list-cover">
                      <div className="list-block">
                        <div className="ser-list-title">{category.name}</div>
                        {
                          category.itemList && category.itemList?.map((item, itemIndex) => {
                            return <div key={itemIndex}>
                              <Item item={item} config={{ redirection: configData.showServicesPdp }} type={category.type} />
                            </div>
                          })
                        }
                      </div>
                    </div>}
                  </> : null}
                </div>
              })
            }
          </div>

          {/* itemsWithoutCategoryList */}
          {itemsWithoutCategoryList.length != 0 && <div className="service-list-cover">
            {itemsWithoutCategoryList?.map((item, itemIndex) => {
              return <div key={itemIndex}>
                <Item item={item} config={{ redirection: configData.showServicesPdp }} type={activeCuratedCategory.type} />
              </div>
            })
            }
          </div>}

        </div>}

        {activeCuratedCategory.entityType === 'items' && <div className="content-wrap">
          {/* <div id="scrolling-div" className="scrolling-div"></div> */}
          {/* categoriesPromotionBanner */}
          {categoriesPromotionBanner &&
            <div className="promotional-banner" id="promotional-banner">
              <ImageGallery items={categoriesPromotionBanner} {...settings} />
            </div>}
          {curatedItemsList?.map((item, itemIndex) => {
            return <div key={itemIndex}>
              <Item item={item} config={{ redirection: configData.showServicesPdp }} type={activeCuratedCategory.type} />
            </div>
          })}
          {/* <VerticalListing itemsList={curatedItemsList} type={activeCuratedCategory.type} /> */}
        </div>}
        {/* <div className="common-grey-boder"></div> */}
      </div> : null}
    </>
  );
}
export default CategoryPage;
