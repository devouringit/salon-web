import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function Footer() {
    const storeMetaData = useSelector(state => state.store ? state.store.storeMetaData : null);
    const storeData = useSelector(state => state.store ? state.store.storeData : null);
    const [socialLinks, setSocialLinks] = useState([]);
    const gender = useSelector(state => state.gender);

    useEffect(() => {
        const { configData: { socialLinks } } = storeData;
        setSocialLinks(socialLinks);
    }, [storeData])

    return (
        <>
            {storeMetaData ? <div>
                < div className="footer-wrap" >
                    <div className="getInTouch">Get In Touch</div>
                    {socialLinks.length !== 0 && socialLinks.map((linkData, index) => {
                        return <div className="social-icon" key={index}>
                            {linkData.name.includes('insta') && <a href={linkData.url} target="_blank"><img src="/assets/images/footer/insta_icon.png" className="insta-icon" /></a>}
                            {linkData.name.includes('facebook') && <a href={linkData.url} target="_blank"><img src="/assets/images/footer/facebook_icon.png" className="fb-icon" /></a>}
                            {linkData.name.includes('youtube') && <a href={linkData.url} target="_blank"><img src="/assets/images/footer/youtube_icon.png" className="fb-icon" /></a>}
                        </div>
                    })}
                    <div className="information-wrap padding-top-bottom">
                        <a href={`https://www.google.com/maps/search/?api=1&query=${storeMetaData.latitude},${storeMetaData.longitude}`} rel="noreferrer" target="_blank">
                            <img src={`/assets/images/footer/${gender}/location_icon.png`} />
                        </a>
                        <span className="containt">
                            <a href={`https://www.google.com/maps/search/?api=1&query=${storeMetaData.latitude},${storeMetaData.longitude}`} rel="noreferrer" target="_blank">
                                {storeMetaData.address}, {storeMetaData.city}, {storeMetaData.state}, {storeMetaData.pincode}
                            </a>
                        </span>
                    </div>
                    <div className="information-wrap padding-top-bottom">
                        <a href={`tel:+91 ${storeMetaData.phone}`}><img src={`/assets/images/footer/${gender}/call_icon.png`} /></a>
                        <span className="containt">
                            {storeMetaData.phone && <a href={`tel:+91 ${storeMetaData.phone}`}>+91 {storeMetaData.phone}</a>}
                            {storeMetaData.phone1 && <><br /><a href={`tel:+91 ${storeMetaData.phone1}`}> +91 {storeMetaData.phone1}</a></>}
                        </span>
                    </div>
                    <div className="information-wrap padding-top-bottom">
                        <a href={`mailto:${storeMetaData.email}`} rel="noreferrer" target="_blank"><img src={`/assets/images/footer/${gender}/mail_icon.png`} /></a>
                        <span className="containt"> <a href={`mailto:${storeMetaData.email}`} rel="noreferrer" target="_blank">{storeMetaData.email}</a></span>
                    </div>
                </div >
                <div className="copyright-wrp">
                    <span>Copyright &copy; 2021 {storeData.tenant}, {storeMetaData.name}</span>
                </div>
            </div > : null
            }
        </>
    )
}

export default Footer
