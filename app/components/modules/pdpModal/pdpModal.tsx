import React, { useState, useEffect } from "react";
// for Accordion starts
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// for Accordion ends
import { PDP_NO_IMAGE } from "@constant/noImage";
import ImageSlider from "@element/imageSlider";
import { useSelector, useDispatch } from 'react-redux';
import { replaceOrderIitems, syncLocalStorageOrder } from "app/redux/actions/order";
import { windowRef } from "@util/window";
import { showSuccess, updatePdpItem } from "@context/actions";
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';

function PdpModal() {
    const [quantity, setQuantity] = useState(0);
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.order.items);
    const item = useSelector(state => state.pdpItem);
    const categoryName = item.category;
    const [activeVariation, setActiveVariation] = useState((item.variations && item.variations?.length !== 0) ? item.variations[0] : null);
    const { configData } = useSelector(state => state.store ? state.store.storeData : null);
    const gender = useSelector(state => state.gender);

    useEffect(() => {
        if (windowRef) {
            // document.body.style.overflow = 'hidden';
            document.body.classList.add("o-h")
            dispatch(syncLocalStorageOrder());
        }
        return () => {
            dispatch(updatePdpItem(''));
            document.body.classList.remove("o-h")
            // document.body.style.overflow = 'unset';
        }

    }, [windowRef]);

    const closePdpMOdal = () => {
        document.body.classList.remove("o-h")
        // document.body.style.overflow = 'unset';
        dispatch(updatePdpItem(''));
    }

    useEffect(() => {
        let totalcopy = 0;
        let quantityCopy = 0;
        if (cartItems.length) {
            const itemIndex: number = cartItems.findIndex((cartItem) => (cartItem.name == item.name && cartItem.category == categoryName) && ((cartItem.variations) ? (cartItem.variations[0].name == activeVariation.name) : true));
            if (itemIndex != -1) {
                totalcopy = cartItems[itemIndex].quantity * cartItems[itemIndex].price;
                quantityCopy = cartItems[itemIndex].quantity;
            }
        }
        setTotal(totalcopy);
        setQuantity(quantityCopy);
    }, [cartItems, activeVariation])

    const addQuantity = () => {
        const cartItemsCopy = [...cartItems];
        const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.category == categoryName) && ((cartItem.variations) ? (cartItem.variations[0].name == activeVariation.name) : true));
        cartItemsCopy[itemIndex].quantity = cartItemsCopy[itemIndex].quantity + 1;
        dispatch(replaceOrderIitems(cartItemsCopy));
        dispatch(showSuccess('Product Added', 2000));
    }

    const removeQuantity = () => {
        const cartItemsCopy = [...cartItems];
        if (quantity == 1) {
            const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.category == categoryName) && ((cartItem.variations) ? (cartItem.variations[0].name == activeVariation.name) : true));
            cartItemsCopy.splice(itemIndex, 1);
            dispatch(replaceOrderIitems(cartItemsCopy));
        } else {
            const itemIndex: number = cartItemsCopy.findIndex((cartItem) => (cartItem.name == item.name && cartItem.category == categoryName) && ((cartItem.variations) ? (cartItem.variations[0].name == activeVariation.name) : true));
            cartItemsCopy[itemIndex].quantity = cartItemsCopy[itemIndex].quantity - 1;
            dispatch(replaceOrderIitems(cartItemsCopy));
        }
        dispatch(showSuccess('Product Removed', 2000));
    }

    const addItemToCart = () => {
        if (activeVariation) {
            const cartItem = {
                "name": item.name,
                "category": categoryName,
                "originalPrice": activeVariation.price,
                "price": (activeVariation.salePrice ? activeVariation.salePrice : activeVariation.price),
                "quantity": 1,
                "remark": null,
                "imagePaths": item.imagePaths,
                "variations": [{
                    "name": activeVariation.name,
                    "price": activeVariation.price,
                    "salePrice": activeVariation.salePrice
                }]
            }
            const cartItemsCopy = [...cartItems];
            cartItemsCopy.push(cartItem);
            dispatch(replaceOrderIitems(cartItemsCopy));
            dispatch(showSuccess('Product Added', 2000));
        } else {
            const cartItem = {
                "name": item.name,
                "category": categoryName,
                "originalPrice": 0,
                "price": item.salePrice || item.price,
                "quantity": 1,
                "remark": null,
                "imagePaths": item.imagePaths,
                "variations": null
            }
            const cartItemsCopy = [...cartItems];
            cartItemsCopy.push(cartItem);
            dispatch(replaceOrderIitems(cartItemsCopy));
            dispatch(showSuccess('Product Added', 2000));
        }
    }

    return (
        <>
            {
                item ?
                    <div className="pdp-modal-wrap">
                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <div>
                                <div className="modal-close" onClick={() => closePdpMOdal()}>
                                    <img src={`/assets/Icons/${gender}/cancel_btn.png`} />
                                </div >
                                <Paper elevation={4} className="outer">
                                    <div className="prodpdpbanner">
                                        <ImageSlider itemsList={item.imagePaths} config={{ redirection: false }} no_image={PDP_NO_IMAGE} />
                                    </div>
                                    <div className="prod-pdp-details clearfix" style={{ marginBottom: cartItems.length != 0 ? '35px' : '0' }}>
                                        {/* <div className="prod-pdp-off">15% OFF</div> */}
                                        <div className="prod-pdp-nameprice clearfix">
                                            <div className="prod-pdp-name">{item.name}</div>
                                            <div className="prod-pdp-price">
                                                {item.variations.length != 0 ? <>
                                                    <>
                                                        {activeVariation.salePrice == 0 ?
                                                            <div className="prod-sale-price">
                                                                <span className="rupee-small">₹ </span> {activeVariation.price}
                                                            </div> :
                                                            <div className="prod-sale-price">
                                                                <span><span className="rupee-small disabled-text">₹ </span>  {activeVariation.price}</span>
                                                                <span className="rupee-small">₹ </span> {activeVariation.salePrice}
                                                            </div>
                                                        }
                                                    </>
                                                </> :
                                                    <>
                                                        {item.salePrice == 0 ?
                                                            <div className="prod-sale-price">
                                                                <span className="rupee-small">₹ </span> {item.price}
                                                            </div> :
                                                            <div className="prod-sale-price">
                                                                <span><span className="rupee-small disabled-text">₹ </span>  {item.price}</span><span className="rupee-small">₹ </span> {item.salePrice}
                                                            </div>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        {configData?.orderingOn && !configData?.readOnlyMenu && <div className="itemcounter">
                                            {quantity == 0 ?
                                                <div className="addtocartbtn" onClick={addItemToCart}>Add to cart</div>
                                                :
                                                <div className="itemcounterinner">
                                                    <div className="counterbuttons">
                                                        <button className="countclick"
                                                            onClick={removeQuantity}>-</button>
                                                        <div className="countnum">
                                                            {quantity}
                                                        </div>
                                                        <button className="countclick"
                                                            onClick={addQuantity}>+</button>
                                                    </div>
                                                </div>
                                            }

                                        </div>}
                                        {/* <div className="prod-pdp-sizetitle">Size</div> */}
                                        <div className="prod-pdp-size">
                                            {item.variations && item.variations?.length !== 0 && item.variations?.map((variant, variantIndex) => {
                                                return <div key={variantIndex}>
                                                    <span className={activeVariation.name === variant.name ? 'active' : ''} onClick={() => setActiveVariation(variant)}>{variant.name}</span>
                                                </div>
                                            })}
                                        </div>
                                        <div className="fullwidth">

                                            {item.description && <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header">
                                                    <div className="accor-title">Description</div>
                                                </AccordionSummary>
                                                <AccordionDetails className="description">
                                                    {item.description}
                                                </AccordionDetails>
                                            </Accordion>}

                                            {item.benefits && <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header">
                                                    <div className="accor-title">Features & Benefits</div>
                                                </AccordionSummary>
                                                <AccordionDetails className="description">
                                                    {item.benefits}
                                                </AccordionDetails>
                                            </Accordion>}

                                            {item.ingredients && <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header">
                                                    <div className="accor-title">Ingredients</div>
                                                </AccordionSummary>
                                                <AccordionDetails className="description">
                                                    {item.ingredients}
                                                </AccordionDetails>
                                            </Accordion>}

                                            {item.howToUse && <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header">
                                                    <div className="accor-title">How To Use</div>
                                                </AccordionSummary>
                                                <AccordionDetails className="description">
                                                    {item.howToUse}
                                                </AccordionDetails>
                                            </Accordion>}
                                            <div className="common-15height"></div>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </Slide>
                    </div > : null
            }
        </>

    );
}

export default PdpModal;
