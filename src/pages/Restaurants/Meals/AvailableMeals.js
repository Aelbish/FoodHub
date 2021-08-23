import React, { useState, useEffect } from "react";
import classes from "./AvailableMeals.module.css";
import Card from "../../../components/UI/Card";
import MealItem from "./MealItem/MealItem";
import useHttp from "../../../hooks/use-http";

const AvailableMeals = (props) => {
  const [meals, setMeals] = useState([]);

  const { isLoading, httpError, sendRequest: fetchTasks } = useHttp();

  const url = `https://foodhub-api.herokuapp.com/restaurant/details/${props.id}`;

  useEffect(() => {
    const performTaskOnData = (tasksObj) => {
      const loadedMeals = tasksObj.data.menu;
      setMeals(loadedMeals);
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

  const mealsList = meals.map((meal) => (
    <MealItem
      id={meal._id}
      key={meal._id}
      name={meal.name}
      type={meal.type}
      price={meal.unit_price}
    />
  ));

  return (
    <div className={classes.divMeals} id="menu">
      <h1 className={classes.name}>Menu</h1>
      <section className={classes.meals}>
        <Card>
          <ul>{mealsList}</ul>
        </Card>
      </section>
    </div>
  );
};

export default AvailableMeals;
