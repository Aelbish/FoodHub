import React, { Fragment, useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import AuthContext from "../../store/auth-context";
import useHttp from "../../hooks/use-http";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const { httpError, sendRequest: fetchTasks } = useHttp();
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const total = cartCtx.totalAmount;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  //make this async function and add a post request and handle error
  const submitOrderHandler = (userData) => {
    setIsSubmittingOrder(true);

    const orderData = cartCtx.items.map((item) => {
      return {
        name: item.name,
        unit_price: item.price,
        quantity: item.amount,
        type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      };
    });

    const postOrderData = {
      items: orderData,
      user: authCtx.token,
      total_amount: total,
      delivery_address: `${userData.street}, ${userData.city}, ${userData.postalCode}`,
    };

    const url = `https://foodhub-api.herokuapp.com/restaurant/order/${cartCtx.restaurantId}`;

    const performTaskOnData = (tasksObj) => {
      if (tasksObj.message === "Order created successfully") {
        setIsSubmittingOrder(false);
        setHasOrdered(true);
        cartCtx.clearCart();
      }
    };

    fetchTasks(
      {
        url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: postOrderData,
      },
      performTaskOnData
    );
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const orderHandler = () => {
    setIsOrdering(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isOrdering && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isOrdering && modalActions}
    </Fragment>
  );

  const isSubmittingModalContent = (
    <p className={classes.total}>Sending order ...</p>
  );

  const didSubmitModalContent = (
    <Fragment>
      <p className={classes.total}>Successfully sent the order.</p>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
      </div>
    </Fragment>
  );

  const errorModalContent = (
    <Fragment>
      <p className={classes.total}>Could not place your order.</p>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
      </div>
    </Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {httpError && hasOrdered && errorModalContent}
      {!httpError && !isSubmittingOrder && !hasOrdered && cartModalContent}
      {!httpError && isSubmittingOrder && isSubmittingModalContent}
      {!httpError && !isSubmittingOrder && hasOrdered && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
