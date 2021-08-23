import React, { useState, useEffect, useContext } from "react";
import Card from "../../components/UI/Card";
import useHttp from "../../hooks/use-http";
import classes from "./RestaurantReview.module.css";
import { FaUser } from "react-icons/fa";
import { Rating } from "@material-ui/lab";
import AuthContext from "../../store/auth-context";

const RestaurantReview = (props) => {
  const authCtx = useContext(AuthContext);
  const [restaurantReviews, setRestaurantReviews] = useState([]);
  const { reloader } = authCtx;
  const { isLoading, httpError, sendRequest: fetchTasks } = useHttp();

  const url = `https://foodhub-api.herokuapp.com/restaurant/review/${props.id}`;

  let hasReviewed = [];

  useEffect(() => {
    const performTaskOnData = (tasksObj) => {
      const loadedRestaurantReviews = tasksObj.data;
      setRestaurantReviews(loadedRestaurantReviews);
    };
    fetchTasks({ url }, performTaskOnData);
  }, [fetchTasks, url, reloader]);

  if (isLoading) {
    return (
      <section className={classes.loading}>
        <p>Loading ...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.error}>
        <p>There was an error, try again.</p>
      </section>
    );
  }

  const reviewList = restaurantReviews.map((review) => (
    <li key={review._id} className={classes.review}>
      <h3>
        <FaUser className={classes.userLogo} /> {review.userId.username}
      </h3>
      <span className={classes.ratingAvg}>
        {((review.food + review.service + review.environment) / 3).toFixed(1)}
      </span>
      <Rating
        size="small"
        className={classes.icon}
        name="half-rating-read"
        defaultValue={parseInt(
          ((review.food + review.service + review.environment) / 3).toFixed(1)
        )}
        precision={0.5}
        readOnly
      />
      <p className={classes.description}>{review.comment}</p>
    </li>
  ));

  if (authCtx.isLoggedIn) {
    //hasReviewed will be an array, filter method returns an array, we PASS boolean
    hasReviewed = restaurantReviews.filter((review) => {
      return review.userId._id === authCtx.token;
    });
  }

  return (
    <div className={classes.divReview} id="reviews">
      <h1 className={classes.name}>
        Reviews
        {authCtx.isLoggedIn && !hasReviewed.length && (
          <button className={classes.addReview} onClick={props.onShowAddReview}>
            Add a Review
          </button>
        )}
      </h1>
      <Card>
        <section className={classes.reviews}>
          {reviewList.length === 0 && <ul>No reviews found</ul>}
          <ul>{reviewList}</ul>
        </section>
      </Card>
    </div>
  );
};

export default RestaurantReview;
