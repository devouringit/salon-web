export const getMetaTagsData = async (storeMetaData, storeData, urlQuery) => {
    return new Promise((res, rej) => {
        let metaTagsFromUrlQuery: any = null;
        //get meta tags data
        let current_page_url: any = urlQuery.pagepath && urlQuery.pagepath.length != 0 ? urlQuery.pagepath[0] : [];  //single folder routing /category
        if (urlQuery.pagepath?.length == 2) current_page_url = urlQuery.pagepath[1]; //multi folder routing /category/product
        if (current_page_url.length == 0 || current_page_url.includes('home')) { //for all pdp urls
            metaTagsFromUrlQuery = { title: '', description: '', image: '', siteName: '' };
            metaTagsFromUrlQuery.title = storeData.tenant.toUpperCase() + ', ' + storeMetaData?.name;
            metaTagsFromUrlQuery.siteName = storeMetaData?.sUrl || null;
            metaTagsFromUrlQuery.description = storeMetaData?.description;
            metaTagsFromUrlQuery.image = storeMetaData?.logoPath;

        } else if (current_page_url.includes('-grp')) { //for all pdp urls
            current_page_url = current_page_url.split('-grp')[0];
            current_page_url = current_page_url.split("-").join(" ");
            if (storeData.curatedGroups) {
                const groupData = storeData?.curatedGroups?.filter((group) => group.name.toLowerCase() === current_page_url);
                if (groupData && groupData?.length) {
                    metaTagsFromUrlQuery = { title: '', description: '', image: '', siteName: '' };
                    metaTagsFromUrlQuery.title = groupData[0].pTitle || groupData[0].name;
                    metaTagsFromUrlQuery.siteName = groupData[0].siteName || null;
                    metaTagsFromUrlQuery.description = groupData[0].pDescription || groupData[0].description;
                    metaTagsFromUrlQuery.image = groupData[0].pImage || (groupData[0].imagePaths && groupData[0]?.imagePaths?.length != 0 ? groupData[0].imagePaths[0].imagePath : '');
                }
            }
        } else if (current_page_url.includes('-pdp')) { //for all pdp urls
            current_page_url = current_page_url.split('-pdp')[0];
            current_page_url = current_page_url.split("-").join(" ");
            if (storeData.itemsList) {
                const item = storeData?.itemsList?.filter((storeItem) => storeItem.name.toLowerCase() === current_page_url);
                if (item && item?.length) {
                    metaTagsFromUrlQuery = { title: '', description: '', image: '', siteName: '' };
                    metaTagsFromUrlQuery.title = item[0].pTitle || item[0].name;
                    metaTagsFromUrlQuery.siteName = item[0].siteName || null;
                    metaTagsFromUrlQuery.description = item[0].pDescription || item[0].description;
                    metaTagsFromUrlQuery.image = item[0].pImage || (item[0].imagePaths && item[0]?.imagePaths?.length != 0 ? item[0].imagePaths[0].imagePath : '');
                }
            }
        } else if (current_page_url.includes('-prp') || current_page_url.includes('-srp')) {

            // for all/our services and all/our products urls
            current_page_url = current_page_url.split('-prp')[0];
            if (current_page_url.includes('-srp')) current_page_url = current_page_url.split('-srp')[0];
            current_page_url = current_page_url.split("-").join(" ");
            const category = storeData?.categories?.filter((storeCategory) => storeCategory.name.toLowerCase() === current_page_url);
            if (category && category?.length) {
                metaTagsFromUrlQuery = { title: '', description: '', image: '', siteName: '' };
                metaTagsFromUrlQuery.title = category[0].pTitle || category[0].name;
                metaTagsFromUrlQuery.siteName = category[0].siteName || null;
                metaTagsFromUrlQuery.description = category[0].pDescription || category[0].description;
                metaTagsFromUrlQuery.image = category[0].pImage || (category[0].icon ? category[0].icon : category[0].imagePaths && category[0]?.imagePaths?.length != 0 ? category[0].imagePaths[0].imagePath : '');
            }
        } else {
            current_page_url = current_page_url.split("-").join(" ");
            //for curated category urls
            let categoryDataFromUrl = null;
            let categoryGroupDataFromUrl = null;
            storeData?.curatedGroups?.map((groupData, groupDataIndex) => {
                if (!categoryDataFromUrl) {
                    groupData?.curatedCategories?.map((categoryData) => {
                        if (!categoryDataFromUrl) {
                            if (categoryData.name.toLowerCase() == current_page_url) {
                                categoryGroupDataFromUrl = groupData;
                                categoryDataFromUrl = categoryData;
                            }
                        }
                    })
                }
                if (groupDataIndex == storeData.curatedGroups?.length - 1 || categoryDataFromUrl) {
                    if (categoryDataFromUrl) {
                        const category = categoryDataFromUrl;
                        if (category) {
                            metaTagsFromUrlQuery = { title: '', description: '', image: '', siteName: '' };
                            metaTagsFromUrlQuery.title = category.pTitle || category.name;
                            metaTagsFromUrlQuery.siteName = category.siteName || null;
                            metaTagsFromUrlQuery.description = category.pDescription || category.description;
                            metaTagsFromUrlQuery.image = category.pImage || (category.icon ? category.icon : category.imagePath);
                        }
                    } else {
                        // active category not found by url name
                        if (categoryGroupDataFromUrl) {
                            const avlActiveCat = categoryGroupDataFromUrl.curatedCategories?.filter((cat) => cat.showOnUi);
                            if (avlActiveCat?.length != 0) {
                                const category = avlActiveCat[0];
                                if (category) {
                                    metaTagsFromUrlQuery = { title: '', description: '', image: '', siteName: '' };
                                    metaTagsFromUrlQuery.title = category.pTitle || category.name;
                                    metaTagsFromUrlQuery.siteName = category.siteName || null;
                                    metaTagsFromUrlQuery.description = category.pDescription || category.description;
                                    metaTagsFromUrlQuery.image = category.pImage || (category.icon ? category.icon : category.imagePath);
                                }
                            }
                        }
                    }
                }
            })
        }
        setTimeout(() => res(metaTagsFromUrlQuery));
    })

}

export const getItemMetaTags = (item) => {
    const metaTags = { title: '', description: '', image: '', siteName: '' }
    if (item) {
        metaTags.title = item.pTitle || item.name;
        metaTags.siteName = item.siteName || null;
        metaTags.description = item.pDescription || item.description;
        metaTags.image = item.pImage || (item.icon ? item.icon : item.imagePaths && item?.imagePaths?.length != 0 ? item.imagePaths[0].imagePath : '');
    }
    return metaTags;
}