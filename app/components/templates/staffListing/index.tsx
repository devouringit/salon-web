import React, { useState } from "react";
import "./stafflistingpage.css";
import product_no_image from "../../../public/images/product_no_image.jpg";

function StaffListingPage() {
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
      <div className="staff-list-cover">
        <div className="staff-cover">
          <div className="staff-left">
            <div className="staff-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="staff-right">
            <div className="staff-name">Cecelia Reyes</div>
            <div className="staff-experty">Haircut Stylist</div>
            <div className="staff-desc">
              It is a long established fact that a reader will be distracted by
              the readable <span>Read More</span>
            </div>
          </div>
        </div>
        <div className="staff-cover">
          <div className="staff-left">
            <div className="staff-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="staff-right">
            <div className="staff-name">Cecelia Reyes</div>
            <div className="staff-experty">Haircut Stylist</div>
            <div className="staff-desc">
              It is a long established fact that a reader will be distracted by
              the readable <span>Read More</span>
            </div>
          </div>
        </div>
        <div className="staff-cover">
          <div className="staff-left">
            <div className="staff-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="staff-right">
            <div className="staff-name">Cecelia Reyes</div>
            <div className="staff-experty">Haircut Stylist</div>
            <div className="staff-desc">
              It is a long established fact that a reader will be distracted by
              the readable <span>Read More</span>
            </div>
          </div>
        </div>
        <div className="staff-cover">
          <div className="staff-left">
            <div className="staff-img-cover">
              <img src={product_no_image} />
            </div>
          </div>
          <div className="staff-right">
            <div className="staff-name">Cecelia Reyes</div>
            <div className="staff-experty">Haircut Stylist</div>
            <div className="staff-desc">
              It is a long established fact that a reader will be distracted by
              the readable <span>Read More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffListingPage;