import React, { useState } from "react";
import "./serviceoptionpage.css";
import product_no_image from "../../../public/images/product_no_image.jpg";

function ServiceOptionPage() {
  return (
    <div className="categorypageContainer">
      <div className="cat-navbar-cover">
        <ul className="cat-navbar-inner">
          <li className="cat-nav-link active">
            Beauty <span></span>
          </li>
          <li className="cat-nav-link">Hair</li>
          <li className="cat-nav-link">Makeup</li>
          <li className="cat-nav-link">Special Occasion</li>
          <li className="cat-nav-link">Item 5</li>
          <li className="cat-nav-link">Item 6</li>
          <li className="cat-nav-link">Item 7</li>
          <li className="cat-nav-link">Item 8</li>
          <li className="cat-nav-link">Item 9</li>
          <li className="cat-nav-link">Item 10</li>
        </ul>
      </div>
      <div className="servoption-list-cover">
        <div className="servoption-cover">
          <div className="servoption-left">
            <div className="servoption-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="servoption-right">
            <div className="servoption-name">Hair Designing</div>
          </div>
        </div>
        <div className="servoption-cover">
          <div className="servoption-left">
            <div className="servoption-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="servoption-right">
            <div className="servoption-name">Hair Designing</div>
          </div>
        </div>
        <div className="servoption-cover">
          <div className="servoption-left">
            <div className="servoption-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="servoption-right">
            <div className="servoption-name">Hair Designing</div>
          </div>
        </div>
        <div className="servoption-cover">
          <div className="servoption-left">
            <div className="servoption-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="servoption-right">
            <div className="servoption-name">Hair Designing</div>
          </div>
        </div>
        <div className="servoption-cover">
          <div className="servoption-left">
            <div className="servoption-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="servoption-right">
            <div className="servoption-name">Hair Designing</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceOptionPage;
