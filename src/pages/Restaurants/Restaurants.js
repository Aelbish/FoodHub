import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Card from "../../components/UI/Card";
import useHttp from "../../hooks/use-http";
import classes from "./Restaurants.module.css";
import CartContext from "../../store/cart-context";
import { Rating } from "@material-ui/lab";

const Restaurants = () => {
  const cartCtx = useContext(CartContext);

  const { state: url } = useLocation();

  const history = useHistory();

  const [restaurants, setRestaurants] = useState([]);

  const { isLoading, httpError, sendRequest: fetchTasks } = useHttp();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    cartCtx.clearCart();
  }, [cartCtx]);

  useEffect(() => {
    const performTaskOnData = (tasksObj) => {
      const loadedRestaurantsArray = tasksObj.data;
      setRestaurants(loadedRestaurantsArray);
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

  const restaurantHandler = (id) => {
    history.push(`/restaurants/${id}`, id);
  };

  const restaurantList = restaurants.map((restaurant) => (
    <li
      key={restaurant._id}
      className={classes.restaurant}
      onClick={() => restaurantHandler(restaurant._id)}
    >
      <img
        className={classes.restaurantLogo}
        src={restaurant.banner_image}
        alt="Restaurant logo"
      />
      <h2 className={classes.h2name}>{restaurant.name}</h2>
      <p className={classes.h3location}>
        {capitalizeFirstLetter(restaurant.address.area)},{" "}
        {capitalizeFirstLetter(restaurant.address.district)}
      </p>
      <p className={classes.ratingAvg}>
        {restaurant.review.average.toFixed(1)}
        <Rating
          size="small"
          className={classes.icon}
          name="half-rating-read"
          defaultValue={parseInt(restaurant.review.average.toFixed(1))}
          precision={0.5}
          readOnly
        />
      </p>
      <p className={classes.rating}>{restaurant.review.count} Reviews</p>
    </li>
  ));

  return (
    <div>
      <h1 className={classes.name}>Restaurants</h1>
      <div className={classes.zero}>
        <section className={classes.restaurants}>
          <Card>
            {restaurantList.length === 0 && (
              <ul className={classes.info}>No restaurants found.</ul>
            )}
            <ul>{restaurantList}</ul>
          </Card>
        </section>
      </div>
    </div>
  );
};
export default Restaurants;
