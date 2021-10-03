import React, { useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';

function ConfirmationModal({ open, title, message, buttonText, handleClose }) {
    return (
        <div className="confirmation-modal-wrap">
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} disableBackdropClick={true} disableEscapeKeyDown={true}>
                <div className="confirmation-modal">
                    <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
                    {/* <div className="modal-close" onClick={handleClose}>
                        <img src="/assets/Icons/cancel_button.png" />
                    </div> */}
                    <div className="fullwidth">
                        <div className="body-text">{message}</div>
                        <div className="user-regIcon" >
                            <Button onClick={handleClose}>{buttonText}</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default ConfirmationModal;