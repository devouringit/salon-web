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
import Link from 'next/link';
import Item from '@element/horizontalItem';
import ImageGallery from 'react-image-gallery';
import router from 'next/router';
import HeadMetaTags from "@module/headMetaTags";
import { getItemMetaTags } from '@util/metaTagsService';
import { useSelector } from 'react-redux';

function AllCategoryPage({ url_Segment, storeData, gender, type, metaTags }) {
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [isThirdLevelCategoryAvl, setIsThirdLevelCategoryAvl] = useState(false);
    const [activeMmetaTags, setmetaTags] = useState(metaTags);
    const [accordianExpanded, setAccordianExpanded] = useState(true);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null);

    useEffect(() => {
        setActiveSubCategory(null);
        setIsThirdLevelCategoryAvl(null);
        setActiveCategory(null);
        let categoryDataFromUrl = null;
        storeData?.categories?.map((categoryData, categoryIndex) => {
            if (categoryData.name.toLowerCase() == url_Segment && categoryData.showOnUi) {
                categoryData.isSelected = true;
                categoryDataFromUrl = categoryData;
                setActiveCategory(categoryData);
                setmetaTags(getItemMetaTags(categoryData));
                if (categoryData.hasSubcategory) {
                    const isAnySubCatWithSubCat = categoryData.categoryList?.filter((cat) => cat.hasSubcategory);
                    if (isAnySubCatWithSubCat?.length != 0) setIsThirdLevelCategoryAvl(true);
                    else setIsThirdLevelCategoryAvl(false)
                } else setIsThirdLevelCategoryAvl(false)
            }
            if (categoryIndex == storeData.categories?.length - 1 && !categoryDataFromUrl) {
                // active category not found by url name
                // console.log('category not found');
                const avlActiveCat = storeData.categories?.filter((cat) => cat.showOnUi && cat.type == type);
                if (avlActiveCat?.length != 0) {
                    // console.log('first category set');
                    setmetaTags(getItemMetaTags(avlActiveCat[0]));
                    setActiveCategory(avlActiveCat[0]);
                } else router.push(baseRouteUrl + '/');
            }
        })
    }, [url_Segment])

    useEffect(() => {
        const element = document.getElementById('scrolling-div');
        window.scrollTo(0, element?.offsetTop);
    }, [activeSubCategory, activeCategory])

    const handleCategoryClick = (category) => {
        setAccordianExpanded(false);
        setActiveSubCategory(category);
    }
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
        const settings = {
            showThumbnails: false,
            showPlayButton: false,
            showBullets: (categoriesPromotionBannerArray && categoriesPromotionBannerArray?.length) > 1 ? true : false,
            autoPlay: true,
            slideDuration: 800,
            slideInterval: 3000,
            startIndex: 0,
            showNav: false,
            showFullscreenButton: false
        }
        return <div className="promotional-banner" id="promotional-banner">
            <ImageGallery items={categoriesPromotionBannerArray} {...settings} />
        </div>
    }

    const onSubCategoryClick = (category) => {
        setAccordianExpanded(false);
        setActiveSubCategory(category);
    }
    return (
        <>
            <HeadMetaTags title={activeMmetaTags.title} siteName={activeMmetaTags.siteName} description={activeMmetaTags.description} image={activeMmetaTags.image} />
            <div className="categorypageContainer">
                <ScrollingNavigation items={storeData.categories} config={{ from: 'all', type }} handleClick={(item) => setActiveCategory(item)} activeCategory={activeCategory} />
                {activeCategory && <div>
                    {isThirdLevelCategoryAvl ?
                        <div className="fullwidth">
                            {activeSubCategory ?
                                <>
                                    <Accordion expanded={accordianExpanded} onChange={() => setAccordianExpanded(accordianExpanded ? false : true)}>
                                        <AccordionSummary
                                            expandIcon={<ArrowDropDownIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className="accor-title">{activeSubCategory.name}</div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="boxlayout">
                                                <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={activeCategory.categoryList} config={{ withShadow: false }}
                                                    handleClick={(category) => handleCategoryClick(category)} />
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                    <>

                                        {activeSubCategory.hasSubcategory ? <div>
                                            {/* <div id="scrolling-div" className="scrolling-div"></div> */}
                                            {getPromotionalBanner(activeSubCategory)}
                                            {activeSubCategory?.categoryList?.map((category, index) => {
                                                return <div key={index} >
                                                    {category.showOnUi && category.active ? <div className="service-list-cover">
                                                        <div className="list-block">
                                                            <div className="ser-list-title">{category.name}</div>
                                                            {category?.itemList?.map((item, itemIndex) => {
                                                                return <div key={itemIndex}>
                                                                    <Item item={item} config={{ redirection: configData.showServicesPdp }} />
                                                                </div>
                                                            })}
                                                        </div>
                                                    </div> : null}
                                                </div>
                                            })}
                                        </div> :
                                            <div className="fullwidth horizontal-product-card-wrap">
                                                {/* <div id="scrolling-div" className="scrolling-div"></div> */}
                                                {getPromotionalBanner(activeSubCategory)}
                                                {
                                                    activeSubCategory?.itemList?.map((item, itemIndex) => {
                                                        return <div key={itemIndex} className="service-list-cover">
                                                            {item.showOnUi && item.active && <div>
                                                                <Item item={item} config={{ redirection: configData.showServicesPdp }} />
                                                            </div>}
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        }
                                    </>

                                </>
                                :
                                <div className="subcat-cover clearfix">
                                    <div className="boxlayout">
                                        <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={activeCategory.categoryList} config={{ withShadow: false }} handleClick={(category) => onSubCategoryClick(category)} />
                                    </div>
                                </div>
                            }
                        </div> :
                        <>
                            {activeCategory.hasSubcategory ? <div>
                                {/* <div id="scrolling-div" className="scrolling-div"></div> */}
                                {getPromotionalBanner(activeCategory)}
                                {activeCategory?.categoryList?.map((category, index) => {
                                    return <div key={index}>
                                        {category.showOnUi && category.active && <div className="service-list-cover">
                                            <div className="list-block">
                                                <div className="ser-list-title">{category.name}</div>
                                                {category?.itemList?.map((item, itemIndex) => {
                                                    return <div key={itemIndex}>
                                                        <Item item={item} config={{ redirection: configData.showServicesPdp }} />
                                                    </div>
                                                })}
                                            </div>
                                        </div>}
                                    </div>
                                })}
                            </div> :
                                <div className="fullwidth horizontal-product-card-wrap">
                                    {/* <div id="scrolling-div" className="scrolling-div"></div> */}
                                    {getPromotionalBanner(activeCategory)}
                                    <div className="service-list-cover">
                                        {
                                            activeCategory?.itemList?.map((item, itemIndex) => {
                                                return <div key={itemIndex}>
                                                    <Item item={item} config={{ redirection: configData.showServicesPdp }} />
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>}
                {/* <div className="common-grey-boder"></div> */}
            </div>
        </>
    );
}

export default AllCategoryPage;
