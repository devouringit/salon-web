import React, { useState, useEffect } from 'react'
import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { replaceOrderIitems } from '@context/actions/order';
import { showSuccess } from '@context/actions';
import { getOrders } from '@storeData/order';
import { store } from '@context/reducers/store';

function OrderConfirmation() {
    const [cookie, setCookie] = useCookies();
    const [userData, setUserCookie] = useState(cookie['user']);
    const store = useSelector(state => state.store);
    const gender = useSelector(state => state.gender);
    const dispatch = useDispatch();
    const router = useRouter()
    const [orderSuccess, setOrderSuccess] = useState(false);
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const [orderData, setOrderData] = useState(null);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null)

    useEffect(() => {
        if (router.query.pagepath.includes("orderconfirmation")) {
            if (router.query.status == 'paid') {
                dispatch(replaceOrderIitems([]));
                setOrderSuccess(true);
                getOrders(router.query.id).then((order: any) => {
                    if (order) {
                        setOrderData(order);
                    }
                })
            } else {
                setOrderSuccess(false);
                dispatch(showSuccess('Your payment has been failed.', 5000));
                router.push(store.baseRouteUrl + 'cart')
            }
        }
    }, [router])

    return (
        <>
            {orderSuccess ?
                <div className="con-main-wrap">
                    {(orderData && orderData.type == 'delivery') ? <div className="con-wrap">
                        <div><img className="cart-logo" src={`/assets/images/${gender}/order_confirm.png`} style={{ width: '50%' }} /></div>
                        <div className="cart-status">{userData.firstName}</div>
                        <div className="cart-subtext">Thank you for your purchase.</div>
                        <div className="cart-subtext">{configData.deliveryDisclaimer}</div>
                    </div> :
                        <div className="con-wrap">
                            <div><img className="cart-logo" src={`/assets/images/${gender}/order_confirm.png`} style={{ width: '50%' }} /></div>
                            <div className="cart-status">{userData.firstName}</div>
                            <div className="cart-subtext">Thank you for your purchase.</div>
                            <div className="cart-subtext">{configData.pickupDisclaimer}</div>
                        </div>
                    }
                    <div className="order-details-wrap">
                        <div className="heading">Order Details:</div>
                        {orderData?.products?.map((item, index) => {
                            return <div className="item-wrap clearfix" key={index}>
                                <div className="name">{item.name}({item.quantity})</div>
                                <div className="price"><span className="rupee-small">₹ </span>{item.price * item.quantity}</div>
                                {item.variations && item.variations.length !== 0 && <div className="variation-wrap">
                                    <div className="name">{item.variations[0].name}</div>
                                </div>}
                            </div>
                        })}
                        <div className="order-total">Total: <span className="rupee-small">₹ </span>{orderData?.total}</div>
                        <div className="cart-button-wrap">
                            <button className="cart-button" onClick={() => router.push(store.baseRouteUrl + '/')}>Explore More</button>
                        </div>
                    </div>
                </div>
                :
                <div className="con-main-wrap">
                    <div className="con-wrap">
                        <div><img className="cart-logo" src={`/assets/images/${gender}/order_confirm.png`} style={{ width: '70%' }} /></div>
                        <div className="cart-status">{userData.firstName}</div>
                        <div className="cart-subtext">Awww! Your payment has been failed.</div>
                        {/* <div className="cart-subtext">Your item is ready for pickup, kindly collect it from frontdesk.</div> */}
                        <div><button className="cart-button" onClick={() => router.push(store.baseRouteUrl + '/')}>Explore More</button></div>
                    </div>
                </div>}
        </>
    )
}

export default OrderConfirmation;
