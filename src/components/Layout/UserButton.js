import React from "react";
import classes from "./UserButton.module.css";
import { FaUser } from "react-icons/fa";
import { useHistory } from "react-router-dom";
const UserButton = () => {
  const history = useHistory();

  const userDetailHandler = () => {
    history.push("/user");
  };

  return (
    <button className={classes.button} onClick={userDetailHandler}>
      <FaUser className={classes.icon} />
    </button>
  );
};

export default UserButton;
