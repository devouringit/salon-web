import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';
import ImageGalleryModal from "@template/imageGalleryModal";
import { LARGE_SLIDER_NO_IMAGE } from '@constant/noImage';
import { useSelector } from 'react-redux';

function ImageSlider({ itemsList, config, no_image }) {
    const router = useRouter()
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const [itemList, setItemList] = useState([{ original: no_image, thumbnail: no_image }]);
    const [openImageGallry, setopenImageGallry] = useState(false);
    const [activeModalConfig, setactiveModalConfig] = useState(null);
    const state = useSelector(state => state);

    useEffect(() => {
        const itemsImageArray = [];
        if (itemsList && itemsList?.length != 0) {
            itemsList?.map((item, index) => {
                if (item.active && (('showOnUi' in item) ? item.showOnUi : true)) {
                    const src = item.imagePath ? item.imagePath : no_image;
                    src && itemsImageArray.push({ original: src, originalClass: '', thumbnail: src, alt: item.name, itemIndex: index, bulletClass: 'slider-bullet' })
                }
            })
            setItemList([...itemsImageArray]);
        }
    }, [itemsList, state])

    const onImageClick = (e) => {
        if (config.redirection) {
            const currentClickedSlide = itemsList?.filter((data) => data.imagePath == e.target.src);
            if (currentClickedSlide && currentClickedSlide?.length !== 0 && currentClickedSlide[0].curatedItems && currentClickedSlide[0]?.curatedItems?.length != 0 && currentClickedSlide[0].entityType === 'images' || currentClickedSlide[0].entityType === 'others') {
                // open images modal
                const modalConfig = {
                    itemList: currentClickedSlide[0].curatedItems,
                    consfig: {},
                    noImagae: LARGE_SLIDER_NO_IMAGE
                }
                setactiveModalConfig(modalConfig)
                setopenImageGallry(true);
            } else if (currentClickedSlide[0].curatedItems && currentClickedSlide[0]?.curatedItems?.length != 0) {
                currentClickedSlide[0] && router.push(baseRouteUrl + currentClickedSlide[0].name.toLowerCase().split(" ").join("-"));
            } else {
                //
            }
        }
    }

    const settings = {
        showThumbnails: false,
        showPlayButton: false,
        showBullets: (itemsList && itemsList?.length) > 1 ? true : false,
        autoPlay: true,
        slideDuration: 800,
        slideInterval: 3000,
        startIndex: 0,
        showNav: false,
        showFullscreenButton: false
    }

    return (
        <>
            <ImageGallery items={itemList} {...settings} onClick={(e) => onImageClick(e)} />
            {openImageGallry && <ImageGalleryModal itemsList={activeModalConfig.itemList} config={activeModalConfig.config} no_image={activeModalConfig.noImage} handleClick={() => setopenImageGallry(false)} />}
        </>
    )
}

export default ImageSlider;
