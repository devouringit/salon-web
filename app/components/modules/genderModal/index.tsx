import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateGenderStatus } from "app/redux/actions/common";
import { useCookies } from "react-cookie"
import { showSuccess } from 'app/redux/actions';

function GenderModal({ onClose, open, gender }) {
    const dispatch = useDispatch();
    const [cookie, setCookie] = useCookies(["gdr"])

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = (value) => {
        dispatch(updateGenderStatus(value));
        dispatch(showSuccess('Gender Filter changed successfully'))
        onClose(value);
        setCookie("gdr", value, {
            path: "/",
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Expires after 1hr
            sameSite: true,
        })
        handleClose();
    };

    return (
        <div className="gender-modal-wrap">
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title" className="gender-modal-title">Looking for ?</DialogTitle>
                <div className="fullwidth gender-wrap">
                    <div className="genderIcon" >
                        <Button onClick={() => handleListItemClick('male')}>
                            <img src={gender === 'male' ? "/assets/Icons/male_active.png" : "/assets/Icons/male.png"} />
                        </Button>
                        <div className="gender-txt">Male</div>
                    </div>
                    <div className="genderIcon"  >
                        <Button onClick={() => handleListItemClick('female')}>
                            <img src={gender === 'female' ? "/assets/Icons/female_active.png" : "/assets/Icons/female.png"} />
                        </Button>
                        <div className="gender-txt">Female</div>
                    </div>
                    <div className={gender === 'all' ? 'genderIcon active' : 'genderIcon'} >
                        <Button onClick={() => handleListItemClick('all')}>
                            <img src={gender === 'all' ? "/assets/Icons/both_active.png" : "/assets/Icons/both.png"} />
                        </Button>
                        <div className="gender-txt">Both</div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default GenderModal;