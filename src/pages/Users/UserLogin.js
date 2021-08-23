import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./UserLogin.module.css";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";
import foodImage from "../../assets/food.jpg";
import CartContext from "../../store/cart-context";
import AuthContext from "../../store/auth-context";
import PopupModal from "../../components/UI/PopupModal";
const UserLogin = () => {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);

  const { isLoggedIn } = authCtx;

  const history = useHistory();

  const { state: from } = useLocation();

  const { isLoadingForSignupLogin, sendRequest: fetchTasks } = useHttp();

  const [loginError, setLoginError] = useState(false);

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;

  if (enteredNameIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const url = "https://foodhub-api.herokuapp.com/auth/login";

  useEffect(() => {
    cartCtx.clearCart();
  }, [cartCtx]);

  useEffect(() => {
    const from = "login";
    isLoggedIn && history.replace("/", from);
    return () => {
      setLoginError(false);
    };
  }, [isLoggedIn, history]);

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    const performTaskOnData = (tasksObj) => {
      if (tasksObj.found) {
        const expirationTime = new Date(new Date().getTime() + 3600000);
        authCtx.login(
          tasksObj.data._id,
          tasksObj.data.username,
          tasksObj.data.email,
          expirationTime.toISOString()
        );
        authCtx.isLoggedIn(true);
        setLoginError(false);
        resetNameInput();
        resetPasswordInput();
      } else {
        setLoginError(true);
      }
    };

    fetchTasks(
      {
        url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          username: enteredName,
          password: enteredPassword,
        },
      },
      performTaskOnData
    );
  };

  const nameInputClasses = nameInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  const passwordInputClasses = passwordInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  return (
    <div className={classes.zero}>
      <div className={classes["main-image"]}>
        <img src={foodImage} alt="Delicious foods" />
      </div>
      <div className={classes.page}>Login</div>
      {from === "register" && (
        <PopupModal>Successfully registered. Please login.</PopupModal>
      )}
      <form className={classes.form} onSubmit={formSubmitHandler}>
        {!isLoadingForSignupLogin && (
          <div>
            <div className={nameInputClasses}>
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="name"
                onChange={nameChangedHandler}
                onBlur={nameBlurHandler}
                value={enteredName}
              />
              {nameInputHasError && (
                <p className={classes["error-text"]}>
                  Please enter a username.
                </p>
              )}
            </div>
            <div className={passwordInputClasses}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={passwordChangedHandler}
                onBlur={passwordBlurHandler}
                value={enteredPassword}
              />
              {passwordInputHasError && (
                <p className={classes["error-text"]}>
                  Please enter a valid password.
                </p>
              )}
            </div>
          </div>
        )}
        <div className={classes["form-actions"]}>
          {isLoadingForSignupLogin && (
            <p className={classes.mes}>Logging in ...</p>
          )}
          {!isLoadingForSignupLogin && (
            <button disabled={!formIsValid}>Login</button>
          )}
          {!authCtx.isLoggedIn && loginError && !isLoadingForSignupLogin && (
            <p className={classes["error-text"]}>
              Invalid username or password.
            </p>
          )}
          {authCtx.isLoggedIn && (
            <p className={classes.success}>Successfully logged in.</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
