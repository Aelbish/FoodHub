import React, { useRef, useState, useContext } from "react";
import classes from "./MealItemForm.module.css";
import Input from "../../../../components/UI/Input";
import AuthContext from "../../../../store/auth-context";

const MealItemForm = (props) => {
  const authCtx = useContext(AuthContext);
  const [amountIsValid, setAmountIsValid] = useState(true);

  const amountInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredAmount = amountInputRef.current.value;
    const enteredAmountNumber = +enteredAmount;

    if (
      enteredAmount.trim().length === 0 ||
      enteredAmountNumber < 1 ||
      enteredAmountNumber > 5
    ) {
      setAmountIsValid(false);
      return;
    }
    //Forwarding the meals from the form which will be used to update the cart-context in another component (MealItem.js)
    //This component only has the amount for each item, but we need the actual items which is in the MealItem.js
    props.onAddToCart(enteredAmountNumber);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      {authCtx.isLoggedIn && (
        <Input
          ref={amountInputRef}
          label="Amount"
          input={{
            id: "amount_" + props.id,
            type: "number",
            min: "1",
            max: "5",
            step: "1",
            defaultValue: "1",
          }}
        />
      )}
      {authCtx.isLoggedIn && <button>+ Add</button>}
      {!amountIsValid && <p>Amount of each item should be between 1 - 5.</p>}
    </form>
  );
};

export default MealItemForm;
