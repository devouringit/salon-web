import React from "react";
import Link from 'next/link'
import HorizontalProductCard from "@module/horizontalProductCard";
import { useSelector } from 'react-redux';

function ProductListing({ productsList, config = {} }) {
  const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);

  const onProductClick = (product) => {
    // console.log(product)
  }
  return (
    <div className="categorypageContainer">
      <div className="product-list-cover">
        {productsList && productsList?.map((item, itemIndex) => {
          if (item.showOnUi) {
            const productUrl = item.name.toLowerCase().split(" ").join("-") + '-pdp';
            return <Link key={itemIndex} href={baseRouteUrl + productUrl} shallow={true}>
              <a>
                <HorizontalProductCard item={item} handleClick={(product) => onProductClick(product)} config={config} />
              </a>
            </Link>
          }
        })}
      </div>
    </div>
  );
}

export default ProductListing;
