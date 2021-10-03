import React from 'react'
import ProductListing from "@template/productListing";
import ServiceListing from "@template/serviceListing";

function VerticalListing({ type, itemsList }) {
    return (
        <>
            {type === 'product' && <ProductListing productsList={itemsList} />}
            {type === 'service' && <ServiceListing servicesList={itemsList} />}
        </>
    )
}

export default VerticalListing
