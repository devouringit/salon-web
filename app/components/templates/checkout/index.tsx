/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { replaceOrderIitems, syncLocalStorageOrder } from "app/redux/actions/order";
import { windowRef } from '@util/window';
import { APISERVICE } from '@util/apiService/RestClient';
import { disableLoader, enableLoader, showError, updatePdpItem } from 'app/redux/actions';
import router from "next/router";
import { useCookies } from "react-cookie";
import { updateUserData } from '@context/actions/user';
import AddressModal from '@module/addressModal';
import Footer from '@module/footer';
import ConfirmationModal from '@module/confirmationModal';

function CheckoutPage() {
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.items);
    const gender = useSelector(state => state.gender);
    const storeData = useSelector(state => state.store.storeData);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null);
    const store = useSelector(state => state.store);
    const [cookie, setCookie] = useCookies();
    const [userData, setUserCookie] = useState(cookie['user']);
    const [orderInstruction, setOrderInstruction] = useState('')
    const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
    const [orderType, setOrderType] = useState('delivery');
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>('');
    const [selectedAddressType, setSelectedAddressType] = useState('Home');
    const [selectedAddressToEdit, setSelectedAddressToEdit] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [showOrderingOff, setShowOrderingOff] = useState(false);

    const [userAddresses, setUserAddresses] = useState([
        { type: 'Home', value: null, isNew: false, isEdited: false, activeImg: `/assets/images/checkout/${gender}/home_sel.png`, inactiveImg: '/assets/images/checkout/home.png' },
        { type: 'Work', value: null, isNew: false, isEdited: false, activeImg: `/assets/images/checkout/${gender}/work_sel.png`, inactiveImg: '/assets/images/checkout/work.png' },
        { type: 'Other', value: null, isNew: false, isEdited: false, activeImg: `/assets/images/checkout/${gender}/other_sel.png`, inactiveImg: '/assets/images/checkout/other.png' },
    ])
    useEffect(() => {
        if (windowRef) {
            dispatch(syncLocalStorageOrder());
            dispatch(updatePdpItem(''));
            getUserDetails(userData.mobileNo).then((res) => {
                setUserCookie(res);
                setCookie("user", res, { //user registration fields
                    path: "/",
                    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    sameSite: true,
                })
                dispatch(updateUserData(res))
            })
        }
    }, [windowRef])

    useEffect(() => {
        if (cookie['user']) {
            setUserCookie(cookie['user'])
            cookie && dispatch(updateUserData(cookie['user']));
        }
    }, [cookie]);

    useEffect(() => {
        if (userData) {

            if (userData?.addressList) {
                const userAddressesCopy = [...userAddresses];
                userAddressesCopy.map((userAdd) => {
                    userData.addressList.map((data) => {
                        if (userAdd.type == data.type) {
                            userAdd.value = data;
                        }
                    })
                })
                const isAnyAddAvl = userAddressesCopy.filter((data) => data.value);
                if (isAnyAddAvl.length != 0) {
                    setSelectedAddressType(isAnyAddAvl[0].type);
                    setSelectedAddress(isAnyAddAvl[0].value)
                }
                setUserAddresses(userAddressesCopy);
            }
        }
    }, [userData])

    useEffect(() => {
        if (cartItems.length) {
            let totalCopy = 0;
            cartItems.map((cartItem) => {
                totalCopy += (cartItem.price * cartItem.quantity);
            })
            setTotal(totalCopy);
        } else {
            // router.push(store.baseRouteUrl + '/');
            setTotal(0);
        }
    }, [cartItems])

    useEffect(() => {
        if (configData) {
            if (!configData.deliveryOn) setOrderType('pickup');
        }
    }, [configData])
    const handleOrderConfirmationMOdalResponse = () => {
        router.push(store.baseRouteUrl + '/');
    }

    const createOrder = (user, status) => {
        if (orderType == 'delivery' && !selectedAddress) {
            dispatch(showError('Please add delivery address'));
        } else {
            dispatch(enableLoader());
            cartItems.map((item) => delete item.imagePaths);
            const order = {
                "storeId": storeData.storeId,
                "tenant": storeData.tenant,
                "store": storeData.store,
                "tenantId": storeData.tenantId,
                "storeKey": storeData.storeKey,
                "guest": user.firstName,
                "guestId": user.id,
                "phone": user.mobileNo,
                "email": user.email,
                "remark": orderInstruction,
                "subtotal": total,
                "total": total,
                "orderDay": new Date(),
                "createdOn": new Date(),
                "appointment": null,
                "products": cartItems,
                "type": orderType,
                "statuses": [
                    {
                        "state": "REQUESTED",
                        "staff": null,
                        "createdOn": new Date()
                    }
                ]
            }
            if (orderType == 'delivery') {
                order['address'] = selectedAddress;
            }
            if (status == 'pay_later') {
                //create regular pay later order
                APISERVICE.POST(process.env.NEXT_PUBLIC_PLACE_ORDER, order).then((res) => {
                    setTimeout(() => {
                        setOrderData(res.data)
                        setShowOrderConfirmation(true);
                        dispatch(disableLoader());
                        dispatch(replaceOrderIitems([]));
                    }, 1000)
                }).catch((error) => {
                    console.log(error);
                    dispatch(disableLoader());
                    dispatch(showError('Order creation failed'))
                })
            } else {//create razor pay order
                APISERVICE.POST(process.env.NEXT_PUBLIC_PLACE_ORDER_RAZOR_PAY, order).then((res) => {
                    setTimeout(() => {
                        const { Razorpay }: any = window;
                        const rzp1 = new Razorpay(res.data);
                        rzp1.open();
                        dispatch(disableLoader());
                    }, 1000)
                }).catch((error) => {
                    console.log(error);
                    dispatch(disableLoader());
                    dispatch(showError('Order creation failed'))
                })
            }
        }
    }

    const proceedOrder = (status) => {
        if (configData?.orderingOn && !configData?.readOnlyMenu) {
            if (userData) {
                createOrder(userData, status);
            }
        } else {
            setShowOrderingOff(true);
        }
    }

    const getUserDetails = (mobileNo) => {
        dispatch(enableLoader());
        return new Promise((res, rej) => {
            const fetchPromise = fetch(`${process.env.NEXT_PUBLIC_GET_USER}/${storeData.tenantId}/${mobileNo}`);
            fetchPromise
                .then((response) => {
                    dispatch(disableLoader());
                    const data = response.json()
                    res(data);
                }).catch(function (error) {
                    dispatch(disableLoader());
                    rej(error);
                    console.log("error");
                });
        });
    }


    const handleAddressModalResponse = (address) => {
        if (address) {
            console.log(address)
            const newAddress = { ...address };
            const userAddressesCopy = [...userAddresses];
            userAddressesCopy.map((userAdd) => {
                if (userAdd.type == newAddress.type) {
                    userAdd.value = address;
                }
            })
            setSelectedAddressType(address.type);
            setUserAddresses(userAddressesCopy);
            setSelectedAddress(newAddress)
        }
        setSelectedAddressToEdit(null);
        setOpenAddressModal(false)
    }

    const setActiveAddressType = (address) => {
        if (address.value) {
            setSelectedAddressType(address.type);
        } else {
            setSelectedAddressToEdit({ type: address.type })
            setOpenAddressModal(true);
        }
    }

    const editAddress = (address) => {
        setSelectedAddressToEdit(address);
        setOpenAddressModal(true);
    }
    return (
        <div className="cart-page-wrap">
            {!showOrderConfirmation ?
                <>
                    {cartItems.length != 0 ?
                        <div className="content-body">
                            {userData && <div className="namennumber">
                                <div className="username">{userData.firstName} {userData.lastName}</div>
                                <div className="usernumber">{userData.mobileNo}</div>
                                <div className="usernumber">{userData.email}</div>
                            </div>}

                            {/* order type --delivery/pickup */}
                            <div className="order-type">
                                {configData?.deliveryOn && <div className={`type-btn ${orderType == 'delivery' ? 'active' : ''}`} onClick={() => setOrderType('delivery')}>Delivery</div>}
                                <div className={`type-btn ${orderType == 'pickup' ? 'active' : ''}`} onClick={() => setOrderType('pickup')} >Pickup</div>
                            </div>
                            {(orderType == 'delivery') ? <div className="address-wrap">
                                <div className="heading-wrap clearfix">
                                    <div className="heading">Delivery Address</div>
                                    <div className="add-type-wrap clearfix">
                                        {userAddresses.map((address, index) => {
                                            return <div className="add-type-details" key={index} onClick={() => setActiveAddressType(address)}>
                                                <div className="type-img-wrap clearfix">
                                                    <div className="image-wrap">
                                                        {address.type === selectedAddressType && <img src={address.activeImg} />}
                                                        {address.type !== selectedAddressType && <img src={address.inactiveImg} />}
                                                    </div>
                                                    <div className="type-name">{address.type}</div>
                                                </div>
                                                {address.type == selectedAddressType && <>
                                                    {address.value ? <div className="add-details">
                                                        <div className="title">{address.value.line}</div>
                                                        <div className="desc">{address.value.area}, {address.value.city}, {address.value.code}</div>
                                                        <div className="edit-address" onClick={() => editAddress(address.value)} >Edit address</div>
                                                    </div> :
                                                        <div className="add-details">
                                                            <div>No address saved yet</div>
                                                            <div className="edit-address" onClick={() => setOpenAddressModal(true)} >Add address</div>
                                                        </div>
                                                    }
                                                </>}
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                                :
                                <div className="address-wrap">
                                    <div className="heading-wrap clearfix">
                                        <div className="heading">Pickup Address</div>
                                    </div>
                                    <div className="address-details">
                                        <div className="title">{store?.storeMetaData?.name}</div>
                                        <div className="desc">    {store?.storeMetaData?.address}, {store?.storeMetaData?.city}, {store?.storeMetaData?.state}, {store?.storeMetaData?.pincode}</div>
                                    </div>
                                </div>}

                            <div className="docktobtm">
                                <div className="insturctionslab">
                                    <input value={orderInstruction} maxLength={180} placeholder="Add Instruction(Optional)" className="instlab" onChange={(e) => setOrderInstruction(e.target.value)} />
                                </div>
                                <div className="subtotalsection">
                                    <div className="subttlsecname">Total</div>
                                    <div className="subttlsecprice"><span className="rupee-small">₹ </span>{total}</div>
                                </div>
                                {(configData?.recieveOnlinePayment || configData?.cod) && <div className="order-btns clearfix">
                                    {configData?.recieveOnlinePayment && <div className="proceedbtn" onClick={() => proceedOrder('')}>
                                        <span>Pay now</span>
                                    </div>}
                                    {orderType == 'pickup' && configData?.cod && <div className="proceedbtn" onClick={() => proceedOrder('pay_later')}>
                                        <span>Pay at the counter</span>
                                    </div>}
                                </div>}
                            </div>
                        </div>
                        :
                        // CART IS EMPTY
                        <div className="emptyCart-main-wrap">
                            <div className="emptyCart-wrap">
                                <div><img className="cart-logo" src={`/assets/images/${gender}/cart.png`} /></div>
                                <div className="cart-status">CART IS EMPTY</div>
                                <div className="cart-subtext">You don't have any item in cart</div>
                                <div><button className="cart-button" onClick={handleOrderConfirmationMOdalResponse}>Explore More</button></div>
                            </div>
                        </div>
                    }
                </>
                :
                // Thank you for your purchase
                <div className="emptyCart-main-wrap">
                    <div className="emptyCart-wrap order-confirmation-checkout">
                        <div><img className="cart-logo" src={`/assets/images/${gender}/order_confirm.png`} style={{ width: '70%' }} /></div>
                        <div className="cart-status">{userData.firstName}</div>
                        <div className="cart-subtext">Thank you for your purchase.</div>
                        {orderType == 'pickup' && <div className="cart-subtext">{configData.pickupDisclaimer}</div>}
                    </div>
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
                    <Footer />
                </div>
            }
            {showOrderingOff && <ConfirmationModal
                open={showOrderingOff}
                title={'Ordering confirmation'}
                message={'Currently we are unserviceable'}
                buttonText={'OK'}
                handleClose={() => setShowOrderingOff(false)}
            />}
            {openAddressModal && <AddressModal open={openAddressModal} handleClose={(res) => handleAddressModalResponse(res)} addressToEdit={selectedAddressToEdit} userAddresses={userAddresses} />}
        </div>
    )
}

export default CheckoutPage
