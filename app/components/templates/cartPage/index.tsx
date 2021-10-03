/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { syncLocalStorageOrder } from "app/redux/actions/order";
import { windowRef } from '@util/window';
import { updatePdpItem } from 'app/redux/actions';
import router from "next/router";
import { useCookies } from "react-cookie";
import UserRegistrationModalAtCart from '@module/userRegistrationAtCart/loginAtCart';
import HorizontalProductCard from '@module/horizontalProductCard';
import { updateUserData } from '@context/actions/user';
import ConfirmationModal from '@module/confirmationModal';

function CartPage() {
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.items);
    const store = useSelector(state => state.store);
    const baseRouteUrl = useSelector(state => state.store.baseRouteUrl);
    const gender = useSelector(state => state.gender);
    const [cookie, setCookie] = useCookies();
    const [userData, setUserCookie] = useState(cookie['user']);
    const [orderInstruction, setOrderInstruction] = useState('')
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null);
    const [showOrderingOff, setShowOrderingOff] = useState(false);

    useEffect(() => {
        if (windowRef) {
            dispatch(syncLocalStorageOrder());
            dispatch(updatePdpItem(''));
        }
    }, [windowRef])

    useEffect(() => {
        if (cookie['user']) {
            setUserCookie(cookie['user'])
            cookie && dispatch(updateUserData(cookie['user']));
        }
    }, [cookie]);

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

    const onLoginClose = (user) => {
        if (user && user.firstName) {
            router.push(baseRouteUrl + 'cart/checkout')
        }
        setOpenLoginModal(false);
    }

    const checkout = () => {
        if (configData?.orderingOn && !configData?.readOnlyMenu) {
            if (userData) {
                router.push(baseRouteUrl + 'cart/checkout')
            } else {
                setOpenLoginModal(true);
            }
        } else {
            setShowOrderingOff(true);
        }
    }
    return (
        <div className="cart-page-wrap">
            {cartItems.length != 0 ?
                <div className="content-body">
                    {/* {userData && <div className="namennumber">
                        <div className="username">{userData.firstName} {userData.lastName}</div>
                        <div className="usernumber">{userData.mobileNo}</div>
                    </div>} */}

                    <div className="itemnumber">{cartItems.length} items in order</div>
                    <div className="itemslistcover" style={{ height: userData ? 'calc(70vh - 32px)' : '60vh' }}>
                        {cartItems.map((cartItem, index) => {
                            return <div key={index} className="horizontal-product-card-wrap">
                                <HorizontalProductCard item={cartItem} handleClick={() => { }} config={{}} fromPage="cart" />
                            </div>
                        })}
                    </div>

                    <div className="docktobtm">
                        {/* <div className="insturctionslab">
                            <input value={orderInstruction} placeholder="Add Instruction(Optional)" className="instlab" onChange={(e) => setOrderInstruction(e.target.value)} />
                        </div> */}
                        <div className="subtotalsection">
                            <div className="subttlsecname">Total</div>
                            <div className="subttlsecprice"><span className="rupee-small">₹ </span>{total}</div>
                        </div>
                        <div className="order-btns clearfix">
                            <div className="proceedbtn checkout-btn" onClick={checkout}>
                                <span>Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
                :
                // CART IS EMPTY
                <div className="emptyCart-main-wrap">
                    <div className="emptyCart-wrap">
                        <div><img className="cart-logo" src={`/assets/images/${gender}/cart.png`} /></div>
                        <div className="cart-status">CART IS EMPTY</div>
                        <div className="cart-subtext">You don't have any item in cart</div>
                        <button className="cart-button empty-cart-btn" onClick={() => router.push(store.baseRouteUrl + '/')}>Explore More</button>
                    </div>
                </div>
            }

            {openLoginModal && <UserRegistrationModalAtCart
                onLoginClose={(e) => onLoginClose(e)}
                open={true}
                heading={'Login for placing order'}
            />}

            {showOrderingOff && <ConfirmationModal
                open={showOrderingOff}
                title={'Ordering confirmation'}
                message={'Currently we are unserviceable'}
                buttonText={'OK'}
                handleClose={() => setShowOrderingOff(false)}
            />}
        </div>
    )
}

export default CartPage
