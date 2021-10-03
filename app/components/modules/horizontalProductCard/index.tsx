import React from 'react'
import { PRODUCT_LIST_NO_IMAGE } from "@constant/noImage";
import { useSelector, useDispatch } from 'react-redux';
import { showSuccess, updatePdpItem } from '@context/actions';
import { replaceOrderIitems } from '@context/actions/order';

const HorizontalProductCard = ({ item, handleClick, fromPage = '', config }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.items);

    const addQuantity = () => {
        const cartItemsCopy = [...cartItems];
        const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.category == item.category) && ((cartItem.variations) ? (cartItem.variations[0].name == item.variations[0].name) : true));
        cartItemsCopy[itemIndex].quantity = cartItemsCopy[itemIndex].quantity + 1;
        dispatch(replaceOrderIitems(cartItemsCopy));
        dispatch(showSuccess('Product Added', 2000));
    }

    const removeQuantity = () => {
        const cartItemsCopy = [...cartItems];
        if (item.quantity == 1) {
            const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.category == item.category) && ((cartItem.variations) ? (cartItem.variations[0].name == item.variations[0].name) : true));
            cartItemsCopy.splice(itemIndex, 1);
            dispatch(replaceOrderIitems(cartItemsCopy));
        } else {
            const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.category == item.category) && ((cartItem.variations) ? (cartItem.variations[0].name == item.variations[0].name) : true));
            cartItemsCopy[itemIndex].quantity = cartItemsCopy[itemIndex].quantity - 1;
            dispatch(replaceOrderIitems(cartItemsCopy));
        }
        dispatch(showSuccess('Product Removed', 2000));
    }

    const itemImageUrl = item.imagePaths && item.imagePaths?.length != 0 ? item.imagePaths[0].imagePath : PRODUCT_LIST_NO_IMAGE;

    const onClickItem = (item: any) => {
        if (config?.onClickAction && !config?.redirection && fromPage !== 'cart') {
            dispatch(updatePdpItem(item));
        }
    }
    if (item.showOnUi || fromPage == 'cart') {
        return (
            <>
                <div className="product-list-cover-wrap">
                    <div className="product-cover clearfix" onClick={() => onClickItem(item)}>
                        {item.iTag && <div className="ribbon ribbon-top-right"><span>{item.iTag}</span></div>}
                        <div className="prod-left">
                            <div className="prod-img-cover">
                                <img src={itemImageUrl} />
                            </div>
                        </div>
                        <div className="prod-right">
                            <div className="prod-name">
                                {item.name}
                                {fromPage == 'cart' && item.variations && <>

                                    <span>{item.variations[0].name}</span>
                                </>}
                            </div>
                            {item.description && <div className="prod-desc">
                                {item.description}
                            </div>}
                            {!fromPage ?
                                <div className="prod-sizeprice">
                                    {item.variations && item.variations.length != 0 ? <>
                                        <div className="prod-size">
                                            <span>{item.variations[0].name}</span>
                                        </div>
                                        <div className="prod-sale-price">
                                            <span><span className="rupee-small disabled-text">₹ </span>  {item.variations[0].price != 0 ? item.variations[0].price : item.price}</span>
                                            {item.variations[0].salePrice != 0 && <> <span className="rupee-small">₹ </span> {item.variations[0].salePrice}</>}
                                        </div>
                                    </> :
                                        <>
                                            {item.salePrice == 0 ?
                                                <div className="prod-sale-price">
                                                    <span className="rupee-small">₹ </span> {item.price}
                                                </div> :
                                                <div className="prod-sale-price">
                                                    <span><span className="rupee-small disabled-text">₹ </span>  {item.price}</span>
                                                    <span className="rupee-small">₹ </span> {item.salePrice}
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                                :
                                <div className="quantity-price-wrap clearfix">
                                    <div className="itemcounterinner">
                                        <div className="counterbuttons">
                                            <button className="countclick" onClick={() => removeQuantity()}>-</button>
                                            <div className="countnum">
                                                {item.quantity}
                                            </div>
                                            <button className="countclick" onClick={() => addQuantity()}>+</button>
                                        </div>
                                    </div>
                                    <div className="price-wrap clearfix">
                                        <div className="prod-sale-price">
                                            <>
                                                <span className="rupee-small">₹ </span> {item.price * item.quantity}
                                            </>
                                            {/* {item.price == item.originalPrice ?
                                                <>
                                                    <span className="rupee-small">₹ </span> {item.price}
                                                </> :
                                                <>
                                                    <span><span className="rupee-small">₹ </span>  {item.originalPrice}</span>
                                                    <span className="rupee-small">₹ </span> {item.price}
                                                </>
                                            } */}
                                        </div>
                                    </div>

                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    } else return null;
}

export default HorizontalProductCard
