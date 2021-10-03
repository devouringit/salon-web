import Link from 'next/link';
import React from 'react'
import { useSelector } from 'react-redux';

function circularItem({ item, config, handleClick }) {
    const itemUrl = item.name.toLowerCase().split(" ").join("-");
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    if (item.entityType === 'images') {
        //open images modal
        return <div className="roundthreetile" {...config} onClick={() => handleClick(item)}>
            <div className="roundthreepic">
                <img src={item.imagePath} />
            </div>
            <div className="roundthreename">{item.name}</div>
        </div>
    } else {
        return (
            <Link href={baseRouteUrl + itemUrl} shallow={true}>
                <div className="roundthreetile" {...config}>
                    <div className="roundthreepic">
                        <img src={item.imagePath} />
                    </div>
                    <div className="roundthreename">{item.name}</div>
                </div>
            </Link>
        )
    }
}

export default circularItem;