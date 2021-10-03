/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import { PDP_NO_IMAGE } from "@constant/noImage";
import ImageSlider from "@element/imageSlider";
import HeadMetaTags from "@module/headMetaTags";
import router from "next/router";

function StaffPdp({ item }) {

  const [showLongDescription, setShowLongDescription] = useState(false);
  const shortDescription = item.description ? item.description?.substring(0, 110) : '';
  const alreadyShortDescription = item.description <= item?.description?.substring(0, 110);
  return (
    <div className="servicepdpcontainer">
      <HeadMetaTags title={item.name} description={item.description} image="" siteName='' />
      <div className="prodpdpbanner">
        <ImageSlider itemsList={item.imagePaths} config={{ redirection: false }} no_image={PDP_NO_IMAGE} />
      </div>
      <div className="serv-pdp-details">
        <div className="serv-pdp-servtype">
          <div className="serv-pdp-servtypename">{item.name}</div>
          <div className="serv-pdp-servtypetime">
            {item.duration} {item.durationType}
          </div>
        </div>
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
        <div className="variations-wrap clearfix">
          <div className="staff-spl-heading">
            Speciality
          </div>
          <div className="staff-spl-desc">
            {item.description}
          </div>
        </div>
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

export default StaffPdp;
