import React from "react";
import classes from "./MealsSummary.module.css";
// import reactLogo from "../../assets/logo192.png";
import aelbishLogo from "../../assets/l20.png";

const MealsSummary = () => {
  return (
    <section className={classes.summary}>
      <h2>
        Feeling hungry? <br />
        Search and order your favorite food from your favorite food place.
      </h2>
      <div>
        <a
          href="https://aelbish.com/"
          target="_blank"
          rel="noreferrer"
          className={classes.link}
        >
          Made by
          <img className={classes.icon} src={aelbishLogo} alt="Aelbish logo" />
        </a>
      </div>
    </section>
  );
};

export default MealsSummary;
