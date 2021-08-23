import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classes from "./UserSignUp.module.css";
import useInput from "../../hooks/use-input";
import useHttp from "../../hooks/use-http";
import foodImage from "../../assets/food.jpg";
import CartContext from "../../store/cart-context";
const UserSignUp = () => {
  const cartCtx = useContext(CartContext);

  const history = useHistory();

  const [registerError, setRegisterError] = useState(true);

  const {
    isLoadingForSignupLogin,
    httpError,
    sendRequest: fetchTasks,
  } = useHttp();

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(
    (value) =>
      value.trim() !== "" && value.includes("@", 1) && !value.endsWith("@")
  );

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredPasswordAgain,
    isValid: enteredPasswordAgainIsValid,
    hasError: passwordAgainInputHasError,
    valueChangeHandler: passwordAgainChangedHandler,
    inputBlurHandler: passwordAgainBlurHandler,
    reset: resetPasswordAgainInput,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;

  if (
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    enteredPasswordAgainIsValid &&
    enteredPassword === enteredPasswordAgain
  ) {
    formIsValid = true;
  }

  const url = "https://foodhub-api.herokuapp.com/auth/register";

  useEffect(() => {
    cartCtx.clearCart();
  }, [cartCtx]);

  useEffect(() => {
    const from = "register";
    !registerError && history.replace("/login", from);
    return () => {
      setRegisterError(true);
    };
  }, [registerError, history]);

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    const performTaskOnData = (tasksObj) => {
      if (tasksObj.message === "User created") {
        setRegisterError(false);
        resetNameInput();
        resetEmailInput();
        resetPasswordInput();
        resetPasswordAgainInput();
      } else {
        setRegisterError(true);
      }
    };

    fetchTasks(
      {
        url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          username: enteredName,
          email: enteredEmail,
          password: enteredPassword,
        },
      },
      performTaskOnData
    );
  };

  const nameInputClasses = nameInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  const emailInputClasses = emailInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  const passwordInputClasses = passwordInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  const passwordAgainInputClasses = passwordAgainInputHasError
    ? `${classes["form-control"]} ${classes.invalid}`
    : classes["form-control"];

  return (
    <div className={classes.zero}>
      <div className={classes["main-image"]}>
        <img src={foodImage} alt="Delicious foods" />
      </div>
      <div className={classes.page}>Register</div>
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
            <div className={emailInputClasses}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                onChange={emailChangedHandler}
                onBlur={emailBlurHandler}
                value={enteredEmail}
              />
              {emailInputHasError && (
                <p className={classes["error-text"]}>
                  Please enter a valid email.
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
            <div className={passwordAgainInputClasses}>
              <label htmlFor="passwordAgain">Re-enter Password</label>
              <input
                type="password"
                id="passwordAgain"
                onChange={passwordAgainChangedHandler}
                onBlur={passwordAgainBlurHandler}
                value={enteredPasswordAgain}
              />
              {passwordAgainInputHasError && (
                <p className={classes["error-text"]}>
                  Please enter a valid password.
                </p>
              )}
              {enteredPassword !== enteredPasswordAgain && (
                <p className={classes["error-text"]}>Passwords do not match.</p>
              )}
            </div>
          </div>
        )}
        <div className={classes["form-actions"]}>
          {!isLoadingForSignupLogin && (
            <button disabled={!formIsValid}>Register</button>
          )}
          {isLoadingForSignupLogin && (
            <p className={classes.mes}>Registering ...</p>
          )}
          {httpError && !isLoadingForSignupLogin && (
            <p className={classes["error-text"]}>
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserSignUp;
