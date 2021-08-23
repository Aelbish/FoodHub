import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import CartContext from "../../store/cart-context";
import useHttp from "../../hooks/use-http";
import classes from "./UserDetail.module.css";
import Card from "../../components/UI/Card";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const UserDetail = () => {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;
  const cartCtx = useContext(CartContext);
  const history = useHistory();
  const { isLoading, httpError, sendRequest: fetchTasks } = useHttp();
  const [orderHistory, setOrderHistory] = useState();
  const url = `https://foodhub-api.herokuapp.com/restaurant/order?userId=${authCtx.token}`;

  useEffect(() => {
    cartCtx.clearCart();
  }, [cartCtx]);

  useEffect(() => {
    !isLoggedIn && history.replace("/login");
    if (isLoggedIn) {
      const performTaskOnData = (tasksObj) => {
        const loadedOrderHistory = tasksObj.data;
        setOrderHistory(loadedOrderHistory);
      };
      fetchTasks({ url }, performTaskOnData);
    } else {
      return;
    }
  }, [fetchTasks, url, isLoggedIn, history]);

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

  const orderList = orderHistory.map((order) => (
    <li key={order._id} className={classes.restaurant}>
      <h2 className={classes.h2name}>{order.restaurant.name}</h2>
      <div className={classes.h3location}>
        {order.items.map((item) => (
          <p key={item._id}>
            {item.name} x {item.quantity} {`($${item.unit_price.toFixed(2)})`}
          </p>
        ))}
      </div>
      <p className={classes.price}>{`$${order.total_amount.toFixed(2)}`}</p>
      <p className={classes.rating}>
        {new Date(order.createdAt).toDateString()}
      </p>
    </li>
  ));

  return (
    <div className={classes.divRes}>
      <h1 className={classes.name}>Your Profile</h1>
      <section className={classes.restaurants}>
        <h1 className={classes.header}>Details</h1>
        <Card className={classes.car}>
          <h3>
            Name
            <FaUser className={classes.iconCheck} />
            {authCtx.username}
          </h3>
          <h3>
            Email
            <MdEmail className={classes.iconCheck} /> {authCtx.email}
          </h3>
        </Card>
      </section>
      <section className={classes.restaurants}>
        <h1 className={classes.header}>Order History</h1>
        <Card>
          {orderList.length === 0 && (
            <ul className={classes.info}>No orders found.</ul>
          )}
          <ul>{orderList}</ul>
        </Card>
      </section>
    </div>
  );
};

export default UserDetail;
