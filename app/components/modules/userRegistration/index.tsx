import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from "react-cookie";
import { APISERVICE } from "@api/RestClient";
import { enableLoader, disableLoader, updateGenderStatus } from "app/redux/actions/common";
import { showSuccess, showError } from 'app/redux/actions/alert';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { updateUserData } from 'app/redux/actions/user';

function UserRegistrationModal({ onClose, open, openStatus }) {
    const dispatch = useDispatch();
    const gender = useSelector(state => state.gender);
    const [cookie, setCookie] = useCookies();
    const [userCookie, setUserCookie] = useState(cookie['user']);
    const [showWellcomeScreen, setShowWellcomeScreen] = useState(false);
    const [showRegistrationScreen, setShowRegistrationScreen] = useState(false);
    const [error, setError] = useState('');
    const storeData = useSelector(state => state.store ? state.store.storeData : null);
    const availableGenders = storeData?.configData?.genderConfig?.split(',');
    const [userData, setUserData] = useState({
        mobileNo: '',
        firstName: '',
        lastName: '',
        email: '',
        area: '',
        gender: '',
        tenantId: storeData?.tenantId ? storeData?.tenantId : ''
    })

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        userCookie && dispatch(updateUserData(userCookie));
    }, [userCookie]);

    useEffect(() => {
        const wellcomeScreenTime = cookie['wst'];
        const registrationScreenTime = cookie['rst'];
        if (!userCookie && !registrationScreenTime) {
            // console.log('time expiry registrationScreenTime');
            setShowWellcomeScreen(false);
            setShowRegistrationScreen(true);
            setCookie("rst", new Date(), { //registration-screen-time
                path: "/",
                expires: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
                sameSite: true,
            })
        } else if (userCookie && !wellcomeScreenTime) {
            // console.log('time expiry wellcomeScreenTime');
            setShowRegistrationScreen(false);
            setShowWellcomeScreen(true);
            setCookie("wst", new Date(), { //wellcome-screen-time
                path: "/",
                expires: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
                sameSite: true,
            })
        } else {
            handleClose();
        }
    }, [openStatus])
    const wrongEmail = () => {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(userData.email)) return false;
        else return true;
    }
    const proceed = () => {
        if (!userData || !userData.mobileNo || userData.mobileNo?.length != 10) {
            setError('phone');
            return;
        } else if (!userData.firstName) {
            setError('firstName');
            return;
        } else if (!userData.email) {
            setError('email');
            return;
        } else if (!userData.gender) {
            setError('gender');
            return;
        } else {
            if (userData.email && wrongEmail()) {
                setError('email');
                return;
            }
            setError('');
            if (userData?.mobileNo && userData?.mobileNo?.length == 10 && userData?.firstName) {
                dispatch(enableLoader());
                APISERVICE.POST(process.env.NEXT_PUBLIC_REGISTER_USER, userData).then((res) => {
                    const userDetails = res.data;
                    setCookie("user", userDetails, { //user registration fields
                        path: "/",
                        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                        sameSite: true,
                    })
                    setUserCookie(userDetails);
                    setShowRegistrationScreen(false);
                    if (userData.gender) {
                        const userGdr = userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
                        if (availableGenders.length !== 0 && availableGenders.includes(userGdr)) {
                            dispatch(updateGenderStatus(userData.gender));
                            setCookie("gdr", userData.gender, {
                                path: "/",
                                expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires after 1hr
                                sameSite: true,
                            })
                        }
                    }
                    dispatch(updateUserData(userDetails))
                    dispatch(disableLoader());
                    dispatch(showSuccess('User registered successfully'));
                    handleClose();
                }).catch((error) => {
                    handleClose();
                    dispatch(disableLoader());
                    dispatch(showError('User registration failed'))
                })
                // setTimeout(() => {
                //     dispatch(showError('User registration failed'))
                //     handleClose();
                //     dispatch(enableLoader());
                // }, 10000)
            }
        }
    }

    const getUserDetails = (mobileNo) => {
        dispatch(enableLoader());
        return new Promise((res, rej) => {
            const fetchPromise = fetch(`${process.env.NEXT_PUBLIC_GET_USER}/${storeData?.tenantId}/${mobileNo}`);
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

    const onPhoneChange = (mobileNo) => {
        setError('');
        const num = mobileNo.charAt(mobileNo?.length - 1).replace(".", '');
        if (((num && num != ' ') && !isNaN(num)) || mobileNo?.length == 0) {
            setUserData({ ...userData, mobileNo: mobileNo });
            if (mobileNo && mobileNo?.length == 10) {
                getUserDetails(mobileNo).then((data: any) => {
                    if (data && data?.mobileNo) {
                        const user = data;
                        setUserCookie(user);
                        if (user.gender) {
                            const userGdr = user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                            if (availableGenders.length !== 0 && availableGenders.includes(userGdr)) {
                                dispatch(updateGenderStatus(user.gender));
                                setCookie("gdr", user.gender, {
                                    path: "/",
                                    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires after 1hr
                                    sameSite: true,
                                })
                            }
                        }
                        // dispatch(showSuccess('User registered successfully'));
                        setCookie("user", user, { //user registration fields
                            path: "/",
                            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                            sameSite: true,
                        })
                        dispatch(updateUserData(user))
                        setShowRegistrationScreen(false);
                        setShowWellcomeScreen(true);
                        setCookie("wst", new Date(), { //wellcome-screen-time
                            path: "/",
                            expires: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
                            sameSite: true,
                        })
                    }
                })
                    .catch((e) => console.log(e))
            }
        }
    }
    return (
        <div className="user-reg-modal">
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} disableBackdropClick={true} disableEscapeKeyDown={true}>

                {showRegistrationScreen && <div className="fullwidth user-reg-modal-wrap">
                    <div className="registrationcover" style={{ backgroundImage: `url(/assets/images/${gender}/register_popup_bg.png)` }}>
                        <DialogTitle id="simple-dialog-title">We will use your information to send offers and promotions</DialogTitle>
                        <div className="fullwidth">
                            <div className="input-wrap">
                                <input className={error == 'phone' ? 'input invalidInput' : 'input'} autoComplete="off" value={userData.mobileNo} onChange={(e) => onPhoneChange(e.target.value)} minLength={10} maxLength={10} placeholder="Mobile Number*" />
                                {error == 'phone' && <div className="error">Enter valid mobile number</div>}
                            </div>
                            <div className="input-wrap">
                                <input className={error == 'firstName' ? 'input invalidInput' : 'input'} autoComplete="off" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} placeholder="Name*" />
                                {error == 'firstName' && <div className="error">Please enter name</div>}
                            </div>
                            <div className="input-wrap">
                                <input className={error == 'email' ? 'input invalidInput' : 'input'} autoComplete="off" type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} placeholder="Email" />
                                {error == 'email' && <div className="error">Please enter valid email</div>}
                            </div>
                            <div className="input-wrap">
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="gender" name="gender1" value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        {/* <FormControlLabel value="all" control={<Radio />} label="Both" /> */}
                                    </RadioGroup>
                                </FormControl>
                                {error == 'gender' && <div className="error">Please select gender</div>}
                            </div>
                            <div className="user-regIcon" >
                                <Button onClick={() => proceed()}>Proceed</Button>
                            </div>
                            <div className="user-skip" >
                                <Button onClick={handleClose}>Skip</Button>
                            </div>
                        </div>
                    </div>
                </div>}

                {showWellcomeScreen && <div className="wellcome-wrap" style={{ backgroundImage: ` url("/assets/images/welcome_back_bg.png")` }}>
                    <div className="modal-close" onClick={handleClose}>
                        <img src="/assets/Icons/cancel_button.png" />
                    </div>
                    <div className="fullwidth user-well-wrap">
                        <div className="user-name">{userCookie?.firstName}</div>
                        <div className="user-skip" >
                            <Button onClick={handleClose}>Skip</Button>
                        </div>
                    </div>
                </div>}

            </Dialog>
        </div>
    );
}

export default UserRegistrationModal;