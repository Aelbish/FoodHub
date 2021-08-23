import React, { useState, Fragment, useRef, useContext } from "react";
import useHttp from "../../hooks/use-http";
import AuthContext from "../../store/auth-context";
import Modal from "../UI/Modal";
import classes from "./AddReview.module.css";
import { Rating } from "@material-ui/lab";

const isEmpty = (value) => value.trim() === "";
const isZero = (value) => value === 0;

const AddReview = (props) => {
  const authCtx = useContext(AuthContext);

  const { httpError, sendRequest: fetchTasks } = useHttp();

  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const [formInputsIsValid, setFormInputsIsValid] = useState({
    foodReview: true,
    serviceReview: true,
    environmentReview: true,
    priceReview: true,
    comment: true,
  });

  const commentInputRef = useRef();

  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [environmentRating, setEnvironmentRating] = useState(0);
  const [priceRating, setPriceRating] = useState(0);

  const confirmReviewHandler = (event) => {
    event.preventDefault();
    authCtx.reloader = !authCtx.reloader;
    const enteredComment = commentInputRef.current.value;
    const enteredFoodReviewIsValid = !isZero(foodRating);
    const enteredServiceReviewIsValid = !isZero(serviceRating);
    const enteredEnvironmentReviewIsValid = !isZero(environmentRating);
    const enteredPriceReviewIsValid = !isZero(priceRating);
    const enteredCommentIsValid = !isEmpty(enteredComment);

    setFormInputsIsValid({
      foodReview: enteredFoodReviewIsValid,
      serviceReview: enteredServiceReviewIsValid,
      environmentReview: enteredEnvironmentReviewIsValid,
      priceReview: enteredPriceReviewIsValid,
      comment: enteredCommentIsValid,
    });

    const formIsValid =
      enteredFoodReviewIsValid &&
      enteredServiceReviewIsValid &&
      enteredEnvironmentReviewIsValid &&
      enteredPriceReviewIsValid &&
      enteredCommentIsValid;

    if (!formIsValid) {
      return;
    }

    setIsSubmittingReview(true);

    const reviewData = {
      userId: authCtx.token,
      food: foodRating,
      service: serviceRating,
      environment: environmentRating,
      price: priceRating,
      comment: enteredComment,
    };

    const id = props.id;

    const url = `https://foodhub-api.herokuapp.com/restaurant/review/${id}`;
    const performTaskOnData = (tasksObj) => {
      if (tasksObj.message === "Success") {
        setIsSubmittingReview(false);
        setHasReviewed(true);
      }
    };

    fetchTasks(
      {
        url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: reviewData,
      },
      performTaskOnData
    );
  };

  const foodReviewControlClasses = `${classes.control} ${
    formInputsIsValid.foodReview ? "" : classes.invalid
  }`;

  const serviceReviewControlClasses = `${classes.control} ${
    formInputsIsValid.serviceReview ? "" : classes.invalid
  }`;

  const environmentReviewControlClasses = `${classes.control} ${
    formInputsIsValid.environmentReview ? "" : classes.invalid
  }`;

  const priceReviewControlClasses = `${classes.control} ${
    formInputsIsValid.priceReview ? "" : classes.invalid
  }`;

  const commentControlClasses = `${classes.control} ${
    formInputsIsValid.comment ? "" : classes.invalid
  }`;

  const reviewModalContent = (
    <form className={classes.form} onSubmit={confirmReviewHandler}>
      <div className={foodReviewControlClasses}>
        <label htmlFor="foodReview">Food</label>
        <Rating
          id="foodReview"
          name="foodReview"
          value={foodRating}
          onChange={(event, newValue) => {
            setFoodRating(newValue);
          }}
        />
        {!formInputsIsValid.foodReview && <p>Please rate the food.</p>}
      </div>
      <div className={serviceReviewControlClasses}>
        <label htmlFor="serviceReview">Service</label>
        <Rating
          id="serviceReview"
          name="serviceReview"
          value={serviceRating}
          onChange={(event, newValue) => {
            setServiceRating(newValue);
          }}
        />
        {!formInputsIsValid.serviceReview && <p>Please rate the service.</p>}
      </div>
      <div className={environmentReviewControlClasses}>
        <label htmlFor="environmentReview">Environment</label>
        <Rating
          id="environmentReview"
          name="environmentReview"
          value={environmentRating}
          onChange={(event, newValue) => {
            setEnvironmentRating(newValue);
          }}
        />
        {!formInputsIsValid.environmentReview && (
          <p>Please rate the environment.</p>
        )}
      </div>
      <div className={priceReviewControlClasses}>
        <label htmlFor="priceReview">Price</label>
        <Rating
          id="priceReview"
          name="priceReview"
          value={priceRating}
          onChange={(event, newValue) => {
            setPriceRating(newValue);
          }}
        />
        {!formInputsIsValid.priceReview && <p>Please rate the price.</p>}
      </div>
      <div className={commentControlClasses}>
        <label htmlFor="comment" className={classes.comment}>
          Comment
        </label>
        <textarea
          id="comment"
          ref={commentInputRef}
          rows={3}
          cols={35}
          className={classes.text}
        />
        {!formInputsIsValid.comment && <p>Please enter some comments.</p>}
      </div>
      <div className={classes.act}>
        <button
          className={classes.buttonRemove}
          type="button"
          onClick={props.onCloseAddReview}
        >
          Cancel
        </button>
        <button className={classes.buttonAdd}>Confirm</button>
      </div>
    </form>
  );

  const isSubmittingModalContent = (
    <p className={classes.total}>Sending review ...</p>
  );

  const didSubmitModalContent = (
    <Fragment>
      <p className={classes.total}>Successfully added your review.</p>
      <div className={classes.actions}>
        <button
          className={classes["button--alt"]}
          onClick={props.onCloseAddReview}
        >
          Close
        </button>
      </div>
    </Fragment>
  );

  const errorModalContent = (
    <Fragment>
      <p className={classes.total}>Could not add your review.</p>
      <div className={classes.actions}>
        <button
          className={classes["button--alt"]}
          onClick={props.onCloseAddReview}
        >
          Close
        </button>
      </div>
    </Fragment>
  );

  return (
    <Modal onClose={props.onCloseAddReview}>
      {httpError && hasReviewed && errorModalContent}
      {!httpError && !isSubmittingReview && !hasReviewed && reviewModalContent}
      {!httpError && isSubmittingReview && isSubmittingModalContent}
      {!httpError &&
        !isSubmittingReview &&
        hasReviewed &&
        didSubmitModalContent}
    </Modal>
  );
};

export default AddReview;
