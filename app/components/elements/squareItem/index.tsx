import Link from 'next/link';
import React from 'react'
import { useSelector } from 'react-redux';

function squareItem({ item, config, handleClick }) {
    if (item && item.name) {
        const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
        let itemUrl = item.name.toLowerCase().split(" ").join("-");
        const endUrlSegment = (config.type == 'service') ? 'srp' : (config.type == 'product' ? 'prp' : '');
        itemUrl = config.type ? `${itemUrl}-${endUrlSegment}` : itemUrl;
        return (
            <>
                {item.entityType === 'images' ?
                    <div>open images modal</div>
                    :
                    <>
                        {config.redirection ?
                            <Link href={baseRouteUrl + itemUrl} shallow={true}>
                                <div className="boxtile">
                                    <div className={config.withShadow ? 'boxpic box-shadow' : 'boxpic'}>
                                        <img src={item.imagePath} />
                                    </div>
                                    <div className="boxname">{item.name}</div>
                                </div>
                            </Link>
                            :
                            <div className={item.isSelected ? "boxtile active" : "boxtile"} id={itemUrl} onClick={() => handleClick(item)}>
                                <div className={config.withShadow ? 'boxpic box-shadow' : 'boxpic'}>
                                    <img src={item.imagePath} />
                                </div>
                                <div className="boxname">{item.name}</div>
                            </div>
                        }
                    </>
                }
            </>
        )
    } else return null;
}

export default squareItem;
