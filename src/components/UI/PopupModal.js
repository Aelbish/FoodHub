import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./PopupModal.module.css";

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.total}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const PopupModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default PopupModal;
