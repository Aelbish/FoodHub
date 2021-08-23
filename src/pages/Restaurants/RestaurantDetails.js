import React from "react";
import Card from "../../components/UI/Card";
import { IoIosCloseCircle, IoIosCheckmarkCircle } from "react-icons/io";
import classes from "./RestaurantDetails.module.css";

const RestaurantDetails = (props) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className={classes.divDetail} id="details">
      <h1 className={classes.name}>Details</h1>
      <Card>
        <p className={classes.ratingAvg}>
          <span>
            Rating{" "}
            <span className={classes.rating}>
              {props.restaurant.review.average.toFixed(1)} (
              {props.restaurant.review.count})
            </span>
          </span>
        </p>
        <p className={classes.ratingAvg}>
          <span>
            Food{" "}
            <span className={classes.rating}>
              {props.restaurant.review.food.toFixed(1)}
            </span>
          </span>
          <span className={classes.rightSpan}>
            Environment{" "}
            <span className={classes.rating}>
              {props.restaurant.review.environment.toFixed(1)}
            </span>{" "}
          </span>
        </p>
        <p className={classes.ratingAvg}>
          <span className={classes.leftSpan}>
            Service{" "}
            <span className={classes.rating}>
              {props.restaurant.review.service.toFixed(1)}
            </span>
          </span>
          <span className={classes.rightSpan}>
            Price{" "}
            <span className={classes.rating}>
              {props.restaurant.review.price.toFixed(1)}
            </span>
          </span>
        </p>
        <p className={classes.ratingAvg}>
          <span>
            Type{" "}
            <span className={classes.rating}>
              {props.restaurant.restaurant_type.map((type) => (
                <span key={Math.random()}>{capitalizeFirstLetter(type)} </span>
              ))}
            </span>
          </span>
        </p>
        <p className={classes.ratingAvg}>
          <span className={classes.leftSpan}>
            Air Conditioned{" "}
            {props.restaurant.features.ac ? (
              <IoIosCheckmarkCircle className={classes.iconCheck} />
            ) : (
              <IoIosCloseCircle className={classes.iconUnCheck} />
            )}
          </span>
          <span className={classes.rightSpan}>
            Takes Reservation{" "}
            {props.restaurant.features.reservation ? (
              <IoIosCheckmarkCircle className={classes.iconCheck} />
            ) : (
              <IoIosCloseCircle className={classes.iconUnCheck} />
            )}
          </span>
        </p>
        <p className={classes.ratingAvg}>
          <span className={classes.leftSpan}>
            Wifi Available{" "}
            {props.restaurant.features.wifi ? (
              <IoIosCheckmarkCircle className={classes.iconCheck} />
            ) : (
              <IoIosCloseCircle className={classes.iconUnCheck} />
            )}
          </span>
          <span className={classes.rightSpan}>
            Smoking Zone{" "}
            {props.restaurant.features.smoking_zone ? (
              <IoIosCheckmarkCircle className={classes.iconCheck} />
            ) : (
              <IoIosCloseCircle className={classes.iconUnCheck} />
            )}
          </span>
        </p>
        <p className={classes.ratingAvg}>
          <span className={classes.leftSpan}>
            Parking Space{" "}
            {props.restaurant.features.parking ? (
              <IoIosCheckmarkCircle className={classes.iconCheck} />
            ) : (
              <IoIosCloseCircle className={classes.iconUnCheck} />
            )}
          </span>
          <span className={classes.rightSpan}>
            Delivery{" "}
            {props.restaurant.features.delivery ? (
              <IoIosCheckmarkCircle className={classes.iconCheck} />
            ) : (
              <IoIosCloseCircle className={classes.iconUnCheck} />
            )}
          </span>
        </p>
      </Card>
    </div>
  );
};

export default RestaurantDetails;
