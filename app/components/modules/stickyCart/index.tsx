import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { replaceOrderIitems, syncLocalStorageOrder } from "app/redux/actions/order";
import { windowRef } from '@util/window';

function StickyCart() {
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const currentPage = useSelector(state => state.currentPage);
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.items);


    useEffect(() => {
        if (windowRef) {
            dispatch(syncLocalStorageOrder());
            document.body.style.overflow = 'unset';
        }
    }, [windowRef])

    useEffect(() => {
        if (cartItems.length) {
            let totalCopy = 0;
            cartItems.map((cartItem) => {
                totalCopy += (cartItem.price * cartItem.quantity);
            })
            setTotal(totalCopy);
        } else {
            setTotal(0);
        }
    }, [cartItems])
    return (
        <>
            {(cartItems.length != 0 && currentPage != 'cart' && currentPage != 'checkout') ? <Link href={baseRouteUrl + 'cart'} shallow={true}>
                <div className="viewcartbar" >
                    <div className="vcbitem">{cartItems.length} Items</div>
                    <div className="vcbprice"><span className="rupee-small whiteFont">₹ </span>{total}</div>
                    <div className="vcbtxt">View Cart</div>
                </div>
            </Link> : null}
        </>
    )
}

export default StickyCart;
