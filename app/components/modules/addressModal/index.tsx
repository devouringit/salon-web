import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import { AddAlarmOutlined } from '@material-ui/icons';

function AddressModal({ open, handleClose, addressToEdit, userAddresses }) {


    const [cookie, setCookie] = useCookies();
    const [userData, setUserCookie] = useState(cookie['user']);
    const [error, seterror] = useState('');
    const [addressObj, setAddressObj] = useState({ line: '', landmark: '', city: '', area: '', code: '' });
    const [showSavedAddress, setShowSavedAddress] = useState(false);
    const [otherAddressList, setOtherAddressList] = useState([]);

    useEffect(() => {
        if (addressToEdit) setAddressObj({ ...addressObj, ...addressToEdit })
    }, [addressToEdit])

    useEffect(() => {
        if (userAddresses) {
            setOtherAddressList(userAddresses.filter((data) => data?.value?.type === 'Other'));
        }
    }, [userAddresses])

    const closeModal = () => {
        handleClose(null);
    }

    const onSaveClick = () => {
        if (!addressObj.line) {
            seterror('address');
        } else if (!addressObj.area) {
            seterror('area');
        } else if (!addressObj.city) {
            seterror('city');
        } else {
            const address = {
                area: addressObj.area,
                city: addressObj.city,
                landmark: addressObj.landmark,
                line: addressObj.line,
                code: addressObj.code,
                latitude: '',
                longitude: '',
                type: addressToEdit.type
            }
            handleClose(address);
        }
    }

    return (
        <div className="address-modal-wrap">
            <Dialog onClose={closeModal} aria-labelledby="simple-dialog-title" open={open} disableBackdropClick={true} disableEscapeKeyDown={true}>
                <div className="modal-close" onClick={closeModal}>
                    <img src="/assets/Icons/cancel_button.png" />
                </div>
                {addressToEdit.type == 'Other' && otherAddressList.length !== 0 && <>
                    <div className="address-toggle-wrap">
                        <div className={`tab ${showSavedAddress ? 'active' : ''}`} onClick={() => setShowSavedAddress(true)}>Saved</div>
                        <div className={`tab ${!showSavedAddress ? 'active' : ''}`} onClick={() => setShowSavedAddress(false)}>Add New</div>
                    </div>
                </>}
                {showSavedAddress ? <div className="address-modal">
                    <div className="fullwidth">
                        {otherAddressList.map((address, index) => {
                            return <div className="address-details" key={index} onClick={() => handleClose(address.value)} >
                                <div className="title">{address.value.line}</div>
                                <div className="desc">{address.value.area}, {address.value.city}, {address.value.code}</div>
                            </div>
                        })}
                    </div>
                </div> :
                    <div className="address-modal">
                        <DialogTitle id="simple-dialog-title">Save <span>{addressToEdit.type}</span> Address</DialogTitle>
                        <div className="fullwidth address-form">
                            <div className="input-wrap">
                                <input className={error == 'address' ? 'input invalidInput' : 'input'} autoComplete="off"
                                    value={addressObj.line}
                                    onChange={(e) => setAddressObj({ ...addressObj, line: e.target.value })}
                                    placeholder="Enter your address*" />
                                {error == 'address' && <div className="error">Please enter address</div>}

                                <input className={error == 'area' ? 'input invalidInput' : 'input'} autoComplete="off"
                                    value={addressObj.area}
                                    onChange={(e) => setAddressObj({ ...addressObj, area: e.target.value })}
                                    placeholder="Enter your area*" />
                                {error == 'area' && <div className="error">Please enter area</div>}

                                <input className={error == 'city' ? 'input invalidInput' : 'input'} autoComplete="off"
                                    value={addressObj.city}
                                    onChange={(e) => setAddressObj({ ...addressObj, city: e.target.value })}
                                    placeholder="Enter your city*" />

                                <input className={error == 'landmark' ? 'input invalidInput' : 'input'} autoComplete="off"
                                    value={addressObj.landmark}
                                    onChange={(e) => setAddressObj({ ...addressObj, landmark: e.target.value })}
                                    placeholder="Enter landmark" />
                                {error == 'landmark' && <div className="error">Please enter landmark</div>}

                                <input className={error == 'pincode' ? 'input invalidInput' : 'input'} autoComplete="off"
                                    value={addressObj.code}
                                    onChange={(e) => setAddressObj({ ...addressObj, code: e.target.value })}
                                    placeholder="Enter your pincode" />


                            </div>
                        </div>
                        <div className="save-add-btn" onClick={onSaveClick} >
                            <Button onClick={onSaveClick}>Save</Button>
                        </div>
                    </div>
                }
            </Dialog>
        </div>
    );
}

export default AddressModal;