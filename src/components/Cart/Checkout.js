import React, { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isNotFiveChars = (value) => value.trim().length !== 5;

const Checkout = (props) => {
  const [formInputsIsValid, setFormInputsIsValid] = useState({
    name: true,
    street: true,
    city: true,
    postalCode: true,
  });

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalCodeInputRef = useRef();
  const cityInputRef = useRef();

  const confirmOrderHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredStreetName = streetInputRef.current.value;
    const enteredPostalCode = postalCodeInputRef.current.value;
    const enteredCity = cityInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetNameIsValid = !isEmpty(enteredStreetName);
    const enteredPostalCodeIsValid = !isNotFiveChars(enteredPostalCode);
    const enteredCityIsValid = !isEmpty(enteredCity);

    setFormInputsIsValid({
      name: enteredNameIsValid,
      street: enteredStreetNameIsValid,
      city: enteredCityIsValid,
      postalCode: enteredPostalCodeIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredCityIsValid &&
      enteredPostalCodeIsValid &&
      enteredStreetNameIsValid;

    if (!formIsValid) {
      return;
    }

    props.onConfirm({
      name: enteredName,
      street: enteredStreetName,
      city: enteredCity,
      postalCode: enteredPostalCode,
    });
  };

  const nameControlClasses = `${classes.control} ${
    formInputsIsValid.name ? "" : classes.invalid
  }`;

  const streetControlClasses = `${classes.control} ${
    formInputsIsValid.street ? "" : classes.invalid
  }`;

  const cityControlClasses = `${classes.control} ${
    formInputsIsValid.city ? "" : classes.invalid
  }`;

  const postalCodeControlClasses = `${classes.control} ${
    formInputsIsValid.postalCode ? "" : classes.invalid
  }`;

  return (
    <form className={classes.form} onSubmit={confirmOrderHandler}>
      <div className={nameControlClasses}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" ref={nameInputRef} />
        {!formInputsIsValid.name && <p>Please enter a valid name.</p>}
      </div>
      <div className={streetControlClasses}>
        <label htmlFor="street"> Street</label>
        <input type="text" id="street" ref={streetInputRef} />
        {!formInputsIsValid.street && <p>Please enter a valid street.</p>}
      </div>
      <div className={postalCodeControlClasses}>
        <label htmlFor="postal">Postal</label>
        <input type="text" id="postal" ref={postalCodeInputRef} />
        {!formInputsIsValid.postalCode && (
          <p>Please enter a valid postal code.</p>
        )}
      </div>
      <div className={cityControlClasses}>
        <label htmlFor="city">City</label>
        <input type="text" id="city" ref={cityInputRef} />
        {!formInputsIsValid.city && <p>Please enter a valid city.</p>}
      </div>
      <div className={classes.actions}>
        <button
          className={classes.buttonRemove}
          type="button"
          onClick={props.onCancel}
        >
          Cancel
        </button>
        <button className={classes.buttonAdd}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
