/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import Link from 'next/link';
import HorizontalProductCard from '@module/horizontalProductCard';
import router from 'next/router';
import { useSelector } from 'react-redux';

function Item({ item, config, type = '' }) {
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    if (item?.showOnUi) {
        let itemUrl = item.itemUrl;
        if (!itemUrl) {
            itemUrl = item.name.toLowerCase().split(" ").join("-") + '-pdp';
            itemUrl = router.query.pagepath[0] + "/" + itemUrl;
        }
        let price = item.price;
        let salePrice = item.salePrice;
        if (item.variations && item.variations.length != 0) {
            if (item.variations[0].variations && item.variations[0].variations.length != 0) {
                if (item.variations[0].variations[0].variations && item.variations[0].variations[0].variations.length != 0) {
                    if (item.variations[0].variations[0].variations[0].variations && item.variations[0].variations[0].variations[0].variations.length != 0) {
                        price = item.variations[0].variations[0].variations[0].variations[0].price;
                        salePrice = item.variations[0].variations[0].variations[0].variations[0].salePrice;
                    } else {
                        price = item.variations[0].variations[0].variations[0].price;
                        salePrice = item.variations[0].variations[0].variations[0].salePrice;
                    }
                } else {
                    price = item.variations[0].variations[0].price;
                    salePrice = item.variations[0].variations[0].salePrice;
                }
            } else {
                price = item.variations[0].price;
                salePrice = item.variations[0].salePrice;
            }
        }
        if (item.type?.toLowerCase() == 'service' || type?.toLowerCase() == 'service') {
            return (
                <>
                    {config.redirection ? <Link href={baseRouteUrl + itemUrl} shallow={true}>
                        <div className="service-cover">
                            <div className="servive-name">{item.name}</div>
                            <div className="servive-price">
                                <>
                                    {salePrice == 0 ?
                                        <div className="prod-sale-price">
                                            &#8377; {price}
                                        </div> :
                                        <div className="prod-sale-price">
                                            <span>&#8377;  {price}</span>
                                            &#8377; {salePrice}
                                        </div>
                                    }
                                </>
                            </div>
                        </div>
                    </Link> :
                        <div className="service-cover">
                            <div className="servive-name">{item.name}</div>
                            <div className="servive-price">
                                <>
                                    {salePrice == 0 ?
                                        <div className="prod-sale-price">
                                            &#8377; {price}
                                        </div> :
                                        <div className="prod-sale-price">
                                            <span>&#8377;  {price}</span>
                                            &#8377; {salePrice}
                                        </div>
                                    }
                                </>
                            </div>
                        </div>
                    }
                </>
            )
        } else if (item.type?.toLowerCase() == 'product' || type?.toLowerCase() == 'product') {
            return <HorizontalProductCard item={item} handleClick={() => { }} config={config} />
        } else return null;
    } else return null;
}

export default Item
