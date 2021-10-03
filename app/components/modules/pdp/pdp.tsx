import React, { useEffect, useState } from 'react'
import ProductPdp from "@template/productPdp";
import StaffPdp from "@template/staffPdp";
import ServicePdp from "@template/servicePdp";
import HeadMetaTags from "@module/headMetaTags";
import { getItemMetaTags } from '@util/metaTagsService';

function PdpPage({ url_Segment, storeData, gender, metaTags }) {

    const [pdpType, setPdpType] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [activeMmetaTags, setmetaTags] = useState(metaTags);

    useEffect(() => {
        if (url_Segment && storeData?.storeId) {
            const item = storeData?.itemsList?.filter((storeItem) => storeItem.name.toLowerCase() === url_Segment);
            setmetaTags(getItemMetaTags(item[0]));
            if (item?.length) {
                setActiveItem(item[0]);
                if (item[0].type === 'service') {
                    setPdpType('service');
                } else if (item[0].type === 'product') {
                    setPdpType('product');
                } else if (item[0].type === 'staff') {
                    setPdpType('staff');
                }
            } else setPdpType('Item-Not-Found');
        }
    }, [storeData, url_Segment])

    return (
        <div className="pdp-wrapper">
            <HeadMetaTags title={activeMmetaTags.title} siteName={activeMmetaTags.siteName} description={activeMmetaTags.description} image={activeMmetaTags.image} />
            {pdpType === 'product' && activeItem && <ProductPdp item={activeItem} />}
            {pdpType === 'service' && activeItem && <ServicePdp item={activeItem} gender={gender} />}
            {pdpType === 'staff' && activeItem && <StaffPdp item={activeItem} />}
            {pdpType === 'Item-Not-Found' && <div>Item Not Found</div>}
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        gender: state.gender,
        storeData: state?.store?.storeData
    }
}
// export default connect(mapStateToProps)(PdpPage);
export default PdpPage;