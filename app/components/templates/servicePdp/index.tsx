/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import { PDP_NO_IMAGE } from "@constant/noImage";
import ImageSlider from "@element/imageSlider";
import HeadMetaTags from "@module/headMetaTags";
import router from "next/router";
import { useSelector } from 'react-redux';

function ServicePdp({ item, gender }) {

  const [showLongDescription, setShowLongDescription] = useState(false);
  const shortDescription = item.description ? item.description?.substring(0, 110) : '';
  const alreadyShortDescription = item.description <= item?.description?.substring(0, 110);
  const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);

  let catName: any = router.query.pagepath[0].split("-");
  catName.pop();
  catName = catName.join(" ")
  return (
    <div className="servicepdpcontainer">
      <div className="modal-close" onClick={() => router.back()}>
        <img src="/assets/Icons/cancel_btn.png" />
      </div>
      <HeadMetaTags title={item.name} description={item.description} image="" siteName='' />
      <div className="prodpdpbanner">
        <ImageSlider itemsList={item.imagePaths} config={{ redirection: false }} no_image={PDP_NO_IMAGE} />
      </div>
      <div className="serv-pdp-details">
        <div className="serv-pdp-servname">{catName}</div>
        <div className="serv-pdp-servtype">
          <div className="serv-pdp-servtypename">{item.name}</div>
          {item.duration !== 0 && <div className="serv-pdp-servtypetime">
            <AccessTimeOutlinedIcon />
            {item.duration} {item.durationType}
          </div>}
        </div>
        {item.description && <>
          {alreadyShortDescription && <>
            <div className="serv-pdp-servtypedesc">{item.description}</div>
          </>}
          {!alreadyShortDescription && <>
            {showLongDescription && <div className="serv-pdp-servtypedesc" onClick={() => setShowLongDescription(false)}>
              {item.description}
              <span>Read Less</span>
            </div>}
            {!showLongDescription && <div className="serv-pdp-servtypedesc" onClick={() => setShowLongDescription(true)}>
              {shortDescription}...
              <span >Read More</span>
            </div>}
          </>}
        </>}
        {item.variations && item.variations?.length !== 0 ? <div className="variations-wrap">
          {item.variations?.map((variant, variantIndex) => {    //weekdays/weekends
            if (('showOnUi' in variant) ? variant.showOnUi : true) {
              return <div key={variantIndex}>
                <div className="serv-pdp-servoffertitle">On {variant.name}</div>
                {variant.price > 0 && <div className="serv-pdp-servofferforpr">&#8377;  {variant.price}</div>}
                {variant.variations && variant.variations?.length !== 0 && variant.variations?.map((subVariant, subVariantIndex) => {    //male/female
                  if (('showOnUi' in subVariant) ? subVariant.showOnUi : true) {
                    return <div key={subVariantIndex}>
                      {gender == 'all' && subVariant.price <= 0 && <div className="serv-pdp-servofferfor">
                        <div className="serv-pdp-servofferfornm highlight">{subVariant.name}</div>
                      </div>}
                      {subVariant.price > 0 && <div className="serv-pdp-servofferfor">
                        {subVariant.name && <div className="serv-pdp-servofferfornm">{subVariant.name}</div>}
                        <div className="serv-pdp-servofferforpr">&#8377;  {subVariant.price}</div>
                      </div>}
                      {subVariant.variations && subVariant.variations?.length !== 0 && subVariant?.variations?.map((subSubVariant, subSubVariantIndex) => {    //adult/kid
                        if (('showOnUi' in subSubVariant) ? subSubVariant.showOnUi : true) {
                          return <div className="serv-pdp-servofferfor" key={subSubVariantIndex}>
                            {subSubVariant.name && <div className="serv-pdp-servofferfornm">{subSubVariant.name}</div>}
                            {subSubVariant.price && <div className="serv-pdp-servofferforpr">&#8377;  {subSubVariant.price}</div>}
                          </div>
                        }
                      })}
                    </div>
                  }
                })}
              </div>
            }
          })}
        </div> :
          <div className="serv-pdp-servofferforpr">&#8377;  {item.price}</div>
        }
        <div className="common-15height"></div>
        {/* <div className="common-grey-boder"></div>
        <div className="common-15height"></div> */}
        {/* <div className="serv-pdp-servcombotitle">
          Combo available with this service
        </div>
        <div className="serv-pdp-servcombofor">
          <div className="serv-pdp-servcombofornm">
            Blow Dry <span>Upto Shoulder</span> + Flat Iron
            <span> Upto Shoulder</span>
          </div>
          <div className="serv-pdp-servcomboforpr">700</div>
        </div>
        <div className="serv-pdp-servcombofor">
          <div className="serv-pdp-servcombofornm">
            Blow Dry <span>Upto Shoulder</span> + Flat Iron
            <span> Upto Shoulder</span>
          </div>
          <div className="serv-pdp-servcomboforpr">700</div>
        </div> */}
      </div>
    </div>
  );
}

export default ServicePdp;
