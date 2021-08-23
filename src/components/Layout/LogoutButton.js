import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import classes from "./LogoutButton.module.css";
import AuthContext from "../../store/auth-context";

const UserButton = () => {
  const authCtx = useContext(AuthContext);

  const history = useHistory();

  const userOnClickHandler = () => {
    authCtx.logout();
    const from = "logout";
    history.replace("/", from);
  };
  return (
    <button className={classes.button} onClick={userOnClickHandler}>
      <BiLogOutCircle className={classes.icon} />
    </button>
  );
};

export default UserButton;
