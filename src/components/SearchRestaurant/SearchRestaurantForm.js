import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ImSearch } from "react-icons/im";
import classes from "./SearchRestaurantForm.module.css";
import useInput from "../../hooks/use-input";
import foodImage from "../../assets/food.jpg";
import CartContext from "../../store/cart-context";
import AuthContext from "../../store/auth-context";
import PopupModal from "../UI/PopupModal";
const SearchRestaurantForm = () => {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;

  const history = useHistory();

  const { state: from } = useLocation();

  const {
    value: enteredFood,
    isValid: enteredFoodIsValid,
    hasError: foodInputHasError,
    valueChangeHandler: foodChangedHandler,
    inputBlurHandler: foodBlurHandler,
    reset: resetFoodInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredLocation,
    isValid: enteredLocationIsValid,
    hasError: locationInputHasError,
    valueChangeHandler: locationChangedHandler,
    inputBlurHandler: locationBlurHandler,
    reset: resetLocationInput,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;

  if (enteredFoodIsValid || enteredLocationIsValid) {
    formIsValid = true;
  }

  const url = `https://foodhub-api.herokuapp.com/restaurant/search?food=${enteredFood.toLowerCase()}&area=${enteredLocation.toLowerCase()}`;

  useEffect(() => {
    cartCtx.clearCart();
  }, [cartCtx]);

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    history.push("/restaurants", url);

    resetFoodInput();
    resetLocationInput();
  };

  const foodInputClasses = foodInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  const locationInputClasses = locationInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  return (
    <div className={classes.zero}>
      <div className={classes["main-image"]}>
        <img src={foodImage} alt="Delicious foods" />
      </div>
      {isLoggedIn && from === "login" && <PopupModal>Welcome back.</PopupModal>}
      {!isLoggedIn && from === "logout" && <PopupModal>Good bye.</PopupModal>}
      <div className={classes.page}>Home</div>
      <form className={classes.form} onSubmit={formSubmitHandler}>
        <div className={foodInputClasses}>
          <label htmlFor="food">Search by Food</label>
          <input
            type="text"
            id="food"
            placeholder="Burger/ Pizza/ Fries"
            onChange={foodChangedHandler}
            onBlur={foodBlurHandler}
            value={enteredFood}
          />
          {foodInputHasError && (
            <p className={classes["error-text"]}>
              Please enter one of the two fields.
            </p>
          )}
        </div>
        <div className={locationInputClasses}>
          <label htmlFor="location">Search by Location</label>
          <input
            type="text"
            id="location"
            onChange={locationChangedHandler}
            onBlur={locationBlurHandler}
            value={enteredLocation}
          />
          {locationInputHasError && (
            <p className={classes["error-text"]}>
              Please enter one of the two fields.
            </p>
          )}
        </div>
        <div className={classes["form-actions"]}>
          <button disabled={!formIsValid}>
            <ImSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchRestaurantForm;
