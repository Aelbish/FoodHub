import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Prompt } from "react-router";
import useHttp from "../../hooks/use-http";
import AvailableMeals from "./Meals/AvailableMeals";
import classes from "./Restaurant.module.css";
import RestaurantReview from "./RestaurantReview";
import RestaurantDetails from "./RestaurantDetails";
import AddReview from "../../components/Review/AddReview";
import { MdRestaurant } from "react-icons/md";
import CartContext from "../../store/cart-context";

const Restaurant = () => {
  const cartCtx = useContext(CartContext);

  const { state: id } = useLocation();

  const [restaurantDetails, setRestaurantDetails] = useState([]);

  const { isLoading, httpError, sendRequest: fetchTasks } = useHttp();

  const url = `https://foodhub-api.herokuapp.com/restaurant/details/${id}`;

  const [addReviewIsShown, setAddReviewIsShown] = useState(false);

  const showAddReviewHandler = () => {
    setAddReviewIsShown(true);
  };

  const hideAddReviewHandler = () => {
    setAddReviewIsShown(false);
  };

  cartCtx.restaurantId = id;

  useEffect(() => {
    const performTaskOnData = (tasksObj) => {
      const loadedRestaurantDetails = tasksObj.data;
      setRestaurantDetails(loadedRestaurantDetails);
    };

    fetchTasks({ url }, performTaskOnData);
  }, [fetchTasks, url]);

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

  return (
    <div>
      <Prompt
        when={cartCtx.items.length > 0}
        message="Items in your cart will be removed. Do you want to leave this page?"
      />
      <div className={classes.divRes}>
        <h1 className={classes.name}>
          <MdRestaurant className={classes.icon} />
          {restaurantDetails.name}
        </h1>
        {/* <section className={classes.nav}>
          <span className={classes.navComp}>Details</span>
          <span className={classes.navComp}>Menu</span>
          <span className={classes.navComp}>Reviews</span>
        </section> */}
        <img
          className={classes.bannerImage}
          src={restaurantDetails.banner_image}
          alt="Restaurant banner"
        />
        <RestaurantDetails restaurant={restaurantDetails} />
        <AvailableMeals id={id} />
        {addReviewIsShown && (
          <AddReview onCloseAddReview={hideAddReviewHandler} id={id} />
        )}
        <RestaurantReview id={id} onShowAddReview={showAddReviewHandler} />
      </div>
    </div>
  );
};

export default Restaurant;
