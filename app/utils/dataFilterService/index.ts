const validate_Item_Day_Date_Time_Gender = (gender, item, status = false) => {
    const currentDate = new Date();
    const currentday = currentDate.toLocaleString('en-us', { weekday: 'long' }).substring(0, 3);
    let isValidtiming = false;
    let isValidDate = false;
    let isValidDay = false;
    let isValidGender = false;
    // if (item.name == "Our Products") debugger // enable debugger if status true

    //validation for from and to time
    if (('fromTime' in item) && ('toTime' in item) && item.fromTime && item.toTime && (item.fromTime != '00:00' && item.toTime != '00:00')) {
        //create from time newDate
        const itemFromTimeDate = new Date();
        const [fhr, fmin] = item.fromTime.split(':');
        itemFromTimeDate.setHours(fhr);
        itemFromTimeDate.setMinutes(fmin);
        //create to time newDate
        const itemToTimeDate = new Date();
        const [thr, tmin] = item.toTime.split(':');
        itemToTimeDate.setHours(thr);
        itemToTimeDate.setMinutes(tmin);

        if (itemFromTimeDate <= new Date() && new Date() <= itemToTimeDate) {
            isValidtiming = true;
        }
    } else isValidtiming = true;

    //validation for from and to date
    if (('fromDate' in item) && ('toDate' in item) && item.fromDate && item.toDate) {
        //re parse from and to date as newDate
        const itemFromDate = new Date(item.fromDate);
        const itemToDate = new Date(item.toDate);
        if (itemFromDate <= new Date() && new Date() <= itemToDate) {
            isValidDate = true;
        }
    } else isValidDate = true;

    //validation for days
    if (('days' in item) && item.days) {
        if (item.days.toLowerCase() == 'all') isValidDay = true;
        else if (item.days.includes(currentday)) isValidDay = true;
    } else isValidDay = true;

    //validation for gender
    if (('considerGroup' in item) && ('group' in item) && item.considerGroup && item.group) {
        isValidGender = (item.group.toLowerCase() === 'all' || gender.toLowerCase() === 'all') ? true : (item.group.toLowerCase() === gender.toLowerCase());
    } else isValidGender = true;

    //check all validation
    return new Promise((res, rej) => {
        if (isValidDate && isValidDay && isValidtiming && isValidGender && item.active) res(true);
        else res(false);
    })
}

const filterItemsList = (itemsList, categoryCheck, gender) => {
    return new Promise((res, rej) => {
        if (itemsList?.length != 0) {
            itemsList = itemsList?.sort((a, b) => (a.index > b.index) ? 1 : -1)
            itemsList?.map(async (item, itemIndex) => {
                item.imagePaths = item.imagePaths ? item.imagePaths : [];
                item.variations = item.variations ? item.variations : [];
                item.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, item);
                if (item.active && item.showOnUi && categoryCheck) {
                    // if (item.name == "Tong and Iron Finish New") debugger;
                    if (item.variations.length != 0) {
                        item.variations.map(async (variant, variantIndex) => {
                            item.variations[variantIndex].showOnUi = await validate_Item_Day_Date_Time_Gender(gender, variant);
                            // if (item.name == "Tong and Iron Finish New") debugger;
                            if (variant.variations && variant.variations.length != 0 && !variant.considerGroup) {

                                variant.variations?.map(async (subVariant) => {
                                    subVariant.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, subVariant);

                                    if (subVariant.variations && !subVariant.considerGroup) {
                                        subVariant.variations?.map(async (subSubVariant) => {
                                            subSubVariant.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, subSubVariant);
                                        })
                                        const isAnySubSubVariantAvl = subVariant.variations?.filter((variantItem) => variantItem.showOnUi);
                                        if (isAnySubSubVariantAvl?.length == 0) subVariant.showOnUi = false;
                                        else subVariant.showOnUi = true;
                                    }
                                })
                                const isAnySubVariantAvl = variant.variations?.filter((variantItem) => variantItem.showOnUi);
                                if (isAnySubVariantAvl?.length == 0) variant.showOnUi = false;
                                else variant.showOnUi = true;
                            }
                            if (variantIndex == item.variations?.length - 1) {
                                const isAnyVariantAvl = item.variations?.filter((variantItem) => variantItem.showOnUi);
                                if (isAnyVariantAvl?.length == 0) item.showOnUi = false;
                                else item.showOnUi = true;
                            }
                        })
                    } else {
                        //if variations not presents then do not apply gender filter
                        item.showOnUi = true;
                    }
                } else {
                    //if item inactive then do not show it on UI
                    item.showOnUi = false;
                }
                if (itemIndex == itemsList?.length - 1) {
                    const isAnyItemAvl = itemsList?.filter((itemData) => itemData.showOnUi);
                    if (isAnyItemAvl?.length == 0) res(false);
                    else res(true);
                }
            })
        } else res(true) //if item not present in category
    })
}

const filterCategoriesList = async (storeData, gender) => {
    return new Promise((res, rej) => {
        const storeCategoriesCopy = storeData.categories ? storeData.categories?.sort((a, b) => (a.index > b.index) ? 1 : -1) : [];
        storeCategoriesCopy?.map(async (storeCategory, storeCategoryIndex) => {
            storeCategory.imagePaths = storeCategory.imagePaths ? storeCategory.imagePaths : [];
            storeCategory.categoryList = storeCategory.categoryList ? storeCategory.categoryList : [];
            storeCategory.itemList = storeCategory.itemList ? storeCategory.itemList : [];
            storeCategory.showOnUi = storeCategory.active ? true : false;
            storeCategory.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, storeCategory);
            if (storeCategory.hasSubcategory && storeCategory?.categoryList) {
                const subCategoryCopy = storeCategory?.categoryList ? storeCategory?.categoryList?.sort((a, b) => (a.index > b.index) ? 1 : -1) : [];
                subCategoryCopy?.map(async (subCategory, subCategoryIndex) => {
                    subCategory.showOnUi = (subCategory.active && storeCategory.showOnUi) ? true : false;
                    subCategory.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, subCategory);
                    if (subCategory.hasSubcategory && subCategory?.categoryList) {
                        const subSubCategoryCopy = subCategory?.categoryList ? subCategory?.categoryList?.sort((a, b) => (a.index > b.index) ? 1 : -1) : [];
                        subSubCategoryCopy.map(async (subSubCategory, subSubCategoryIndex) => {
                            //if any parent category is inactive
                            subSubCategory.showOnUi = (subSubCategory.active && subCategory.showOnUi) ? true : false;
                            subSubCategory.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, subSubCategory);
                            filterItemsList(subSubCategory.itemList, subSubCategory.showOnUi, gender).then((result) => {
                                subSubCategory.showOnUi = subSubCategory.showOnUi ? result : false;
                                if (subSubCategoryIndex == subCategory.categoryList?.length - 1) {
                                    const isAnySubSubCategoryAvl = subCategory.categoryList?.filter((categoryItem) => categoryItem.showOnUi);
                                    if (isAnySubSubCategoryAvl?.length == 0) subCategory.showOnUi = false;
                                    else if (subCategory.showOnUi) subCategory.showOnUi = true;

                                    const isAnySubCategoryAvl = storeCategory.categoryList?.filter((categoryItem) => categoryItem.showOnUi);
                                    if (isAnySubCategoryAvl?.length == 0) storeCategory.showOnUi = false;
                                    else if (storeCategory.showOnUi) storeCategory.showOnUi = true;
                                }
                            })
                        })
                    } else {
                        filterItemsList(subCategory.itemList, subCategory.showOnUi, gender).then((result) => {
                            subCategory.showOnUi = subCategory.showOnUi ? result : false;
                            if (subCategoryIndex == storeCategory.categoryList?.length - 1) {
                                const isAnySubCategoryAvl = storeCategory.categoryList?.filter((categoryItem) => categoryItem.showOnUi);
                                if (isAnySubCategoryAvl?.length == 0) storeCategory.showOnUi = false;
                                else if (storeCategory.showOnUi) storeCategory.showOnUi = true;
                            }
                        })
                    }
                })
            } else {
                if (storeCategory.itemList.length == 0) {
                    storeCategory.showOnUi = false;
                } else {
                    filterItemsList(storeCategory.itemList, storeCategory.showOnUi, gender).then((result) => {
                        storeCategory.showOnUi = result ? storeCategory.showOnUi : false;
                    })
                }
            }
            if (storeCategoryIndex == storeCategoriesCopy?.length - 1) res(storeCategoriesCopy);
        })
    })
}

const getCategoryDetails = (filteredCategories, curatedItemData, gender) => {
    return new Promise((res, rej) => {
        filteredCategories?.map(async (storeCategory) => {
            if (storeCategory.name === curatedItemData.name) {
                curatedItemData.categoryDetails = storeCategory;
                curatedItemData.showOnUi = storeCategory.showOnUi;
                res(curatedItemData);
            } else {
                if (storeCategory.hasSubcategory) {
                    storeCategory?.categoryList?.map(async (subCategory) => {
                        if (subCategory.name === curatedItemData.name) {
                            curatedItemData.categoryDetails = subCategory;
                            curatedItemData.showOnUi = subCategory.showOnUi;
                            res(curatedItemData);
                        } else {
                            if (subCategory.hasSubcategory) {
                                subCategory?.categoryList?.map(async (subSubCategory) => {
                                    if (subSubCategory.name === curatedItemData.name) {
                                        curatedItemData.categoryDetails = subSubCategory;
                                        curatedItemData.showOnUi = subSubCategory.showOnUi;
                                        res(curatedItemData);
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    })
}

const getItemsList = (filteredCategories) => {
    let itemsList = [];
    filteredCategories?.map((category) => {
        if (category.hasSubcategory && category?.categoryList.length != 0) {
            category?.categoryList?.map((subCategory) => {
                if (subCategory.hasSubcategory && subCategory?.categoryList.length != 0) {
                    subCategory?.categoryList?.map((subSubCategory) => {
                        subSubCategory.itemList && (itemsList = [...itemsList, ...subSubCategory.itemList]);
                    })
                } else subCategory.itemList && (itemsList = [...itemsList, ...subCategory.itemList]);
            })
        } else category.itemList && (itemsList = [...itemsList, ...category.itemList]);
    })
    itemsList = itemsList.sort((a, b) => (a.index > b.index) ? 1 : -1)
    return itemsList;
}

//filter curated group on the basis of gender
export const prepareStoreData = (storeData, gender) => {
    return new Promise((res, rej) => {
        if (storeData && storeData.storeId && gender) {
            //category and items validations
            const storeCopy = storeData;
            filterCategoriesList(storeCopy, gender).then((filteredCategories) => {
                storeCopy.categories = filteredCategories;
                storeCopy.categories = storeCopy.categories.sort((a, b) => (a.index > b.index) ? 1 : -1)
                storeCopy.itemsList = getItemsList(filteredCategories);
                storeCopy.curatedGroups && storeCopy.curatedGroups?.map(async (curatedGroupData, curatedGroupDataIndex) => {
                    curatedGroupData.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, curatedGroupData);
                    curatedGroupData.curatedCategories = curatedGroupData.curatedCategories ? curatedGroupData.curatedCategories : [];
                    if (curatedGroupData.curatedCategories.length != 0 && curatedGroupData.showOnUi) {
                        curatedGroupData.curatedCategories = curatedGroupData.curatedCategories.sort((a, b) => (a.index > b.index) ? 1 : -1)
                        curatedGroupData.curatedCategories && curatedGroupData.curatedCategories?.map(async (curatedCategoryData, curatedCategoryDataIndex) => {
                            curatedCategoryData.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, curatedCategoryData);
                            if (curatedCategoryData.curatedItems && curatedCategoryData.showOnUi) {
                                curatedCategoryData.curatedItems = curatedCategoryData.curatedItems.sort((a, b) => (a.index > b.index) ? 1 : -1)
                                curatedCategoryData.curatedItems && curatedCategoryData.curatedItems?.map(async (curatedItemData, curatedItemDataIndex) => {
                                    curatedItemData.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, curatedItemData);
                                    if (curatedCategoryData.entityType === 'category') {
                                        getCategoryDetails(filteredCategories, curatedItemData, gender).then((data) => {
                                            curatedItemData = data;
                                            if (curatedItemData?.categoryDetails?.hasSubcategory && curatedItemData.categoryDetails.categoryList.length != 0) {
                                                curatedItemData.categoryDetails.categoryList?.map((subCategory) => {          //subCategory curatedItemData.categoryDetails 2nd level
                                                    if (subCategory.hasSubcategory && subCategory.categoryList.length != 0) {
                                                        subCategory.categoryList?.map((subSubCategory) => {          //subsubCategory curatedItemData.categoryDetails 3rd level
                                                            if (subSubCategory.hasSubcategory) {
                                                                // console.log()
                                                            } else {
                                                                if (curatedGroupData.showOnUi && curatedCategoryData.showOnUi && curatedItemData.categoryDetails.showOnUi && subCategory.showOnUi && subSubCategory.showOnUi) {
                                                                    curatedGroupData.showOnUi = curatedCategoryData.showOnUi = curatedItemData.categoryDetails.showOnUi = subCategory.showOnUi = subSubCategory.showOnUi;
                                                                }
                                                            }
                                                        })
                                                    } else {
                                                        if (curatedGroupData.showOnUi && curatedCategoryData.showOnUi && curatedItemData.categoryDetails.showOnUi && subCategory.showOnUi) {
                                                            curatedGroupData.showOnUi = curatedGroupData.showOnUi || (curatedCategoryData.showOnUi = curatedItemData.categoryDetails.showOnUi = subCategory.showOnUi);
                                                        }
                                                    }
                                                })
                                            } else {
                                                if (curatedGroupData.showOnUi && curatedCategoryData.showOnUi && curatedItemData.categoryDetails.showOnUi) {
                                                    curatedGroupData.showOnUi = curatedCategoryData.showOnUi = curatedItemData.categoryDetails.showOnUi;
                                                }
                                            }
                                        })
                                    } else if (curatedCategoryData.entityType === 'items') {
                                        const itemDataFromFilterItems = storeCopy.itemsList?.filter((filterItem) => filterItem.name == curatedItemData.name);
                                        curatedItemData.showOnUi = itemDataFromFilterItems?.length != 0 ? itemDataFromFilterItems[0].showOnUi : false;
                                    } else if (curatedCategoryData.entityType === 'images') {
                                        curatedItemData.showOnUi = curatedCategoryData.showOnUi;
                                        curatedItemData.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, curatedItemData);
                                        // curatedCategoryData.showOnUi = true;
                                    }
                                    if (curatedItemDataIndex == curatedCategoryData.curatedItems?.length - 1) {
                                        const isAnyCuratedItemAvl = curatedCategoryData.curatedItems && curatedCategoryData.curatedItems?.filter((curatedItem) => curatedItem.showOnUi);
                                        if (isAnyCuratedItemAvl && isAnyCuratedItemAvl?.length != 0) curatedCategoryData.showOnUi = true;
                                        else curatedCategoryData.showOnUi = false;
                                    }
                                })
                            }
                            if (curatedCategoryDataIndex == curatedGroupData.curatedCategories?.length - 1) {
                                const isAnyCuratedCatAvl = curatedGroupData.curatedCategories?.filter((curatedCat) => curatedCat.showOnUi);
                                if (isAnyCuratedCatAvl && isAnyCuratedCatAvl?.length != 0) curatedGroupData.showOnUi = true;
                                else curatedGroupData.showOnUi = false;
                            }
                        })
                    }
                })
            })

            //sliders validations
            storeCopy.sliders && storeCopy.sliders?.map(async (sliderData) => {
                sliderData.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, sliderData);
            })
            storeCopy.curatedGroups = storeCopy.curatedGroups.sort((a, b) => (a.index > b.index) ? 1 : -1)
            if (storeCopy.sliders) {
                storeCopy.sliders = storeCopy.sliders?.filter((data) => data.active);
                storeCopy.sliders = storeCopy.sliders?.sort((a, b) => (a.index > b.index) ? 1 : -1)
            } else {
                storeCopy.sliders = [];
            }

            setTimeout(() => {
                if (storeCopy.curatedGroups && storeCopy.curatedGroups.length) {
                    storeCopy.curatedGroups && storeCopy.curatedGroups?.map(async (curatedGroupData, index) => {
                        if (curatedGroupData.showOnUi && ('considerGroup' in curatedGroupData) && ('group' in curatedGroupData) && curatedGroupData.considerGroup && curatedGroupData.group) {
                            curatedGroupData.showOnUi = await validate_Item_Day_Date_Time_Gender(gender, curatedGroupData);
                            curatedGroupData.showOnUi = (curatedGroupData.group.toLowerCase() === 'all' || gender.toLowerCase() === 'all') ? true : (curatedGroupData.group.toLowerCase() === gender.toLowerCase());
                        }
                        curatedGroupData.curatedCategories.map(async (categoryData, curatedCategoryDataIndex) => {
                            if (categoryData.showOnUi && ('considerGroup' in categoryData) && ('group' in categoryData) && categoryData.considerGroup && categoryData.group) {
                                categoryData.showOnUi = (categoryData.group.toLowerCase() === 'all' || gender.toLowerCase() === 'all') ? true : (categoryData.group.toLowerCase() === gender.toLowerCase());
                            }

                            if (curatedCategoryDataIndex == curatedGroupData.curatedCategories?.length - 1) {
                                const isAnyCuratedCatAvl = curatedGroupData.curatedCategories?.filter((curatedCat) => curatedCat.showOnUi);
                                if (isAnyCuratedCatAvl && isAnyCuratedCatAvl?.length != 0 && curatedGroupData.showOnUi) curatedGroupData.showOnUi = true;
                                else curatedGroupData.showOnUi = false;
                            }
                        })
                        if (index == storeCopy.curatedGroups.length - 1) {
                            res(storeCopy)
                        }
                    })
                } else res({ ...storeCopy });
            });
        }
    })
}
