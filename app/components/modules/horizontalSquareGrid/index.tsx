import React from 'react'
import { SKILLED_STAFF_NO_IMAGE } from "@constant/noImage";
import Link from 'next/link';
import { useSelector } from 'react-redux';

function HorizontalSquareGrid({ items, config }) {
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    return (
        <>
            {items && items?.map((item, index) => {
                let itemUrl = item.name.toLowerCase().split(" ").join("-");
                if (item.type == 'staff') itemUrl = itemUrl + '-pdp'
                if (item.active && item.showOnUi) {
                    if (!item.imagePath) item.imagePath = SKILLED_STAFF_NO_IMAGE;
                    if (item.entityType === 'images') {
                        //open images modal
                    } else {
                        return <Link href={baseRouteUrl + itemUrl} shallow={true} key={index}>
                            <div className="skilled-tile clearfix" key={index} {...config}>
                                <div className="skilled-tile-pic">
                                    <img src={item.imagePath} />
                                </div>
                                <div className="skilled-tile-name">{item.name}</div>
                                {/* <div className="skilled-tile-expert">{item.name}</div> */}
                            </div>
                        </Link>
                    }
                }
            })}
        </>
    )
}

export default HorizontalSquareGrid;
