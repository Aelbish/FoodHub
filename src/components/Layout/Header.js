import React, { Fragment, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./Header.module.css";
import HeaderCartButton from "./HeaderCartButton";
import LogoutButton from "./LogoutButton";
import logo from "../../assets/logo192.png";
import UserButton from "./UserButton";

const Header = (props) => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <Fragment>
      <header className={classes.header}>
        <Link to="/">
          <img className={classes.logo} src={logo} alt="Logo" />
          <h1 className={classes.customh1}>FoodHub&nbsp;</h1>
        </Link>
        {!isLoggedIn && (
          <span className={classes.headers}>
            <NavLink activeClassName={classes.activeHeader} to="/login">
              Login
            </NavLink>
          </span>
        )}
        {!isLoggedIn && (
          <span className={classes.headers}>
            <NavLink activeClassName={classes.activeHeader} to="/register">
              Register
            </NavLink>
          </span>
        )}
        {isLoggedIn && (
          <span className={classes.icons}>
            <HeaderCartButton onClick={props.onShowCart} />
            <UserButton />
            <LogoutButton />
          </span>
        )}
      </header>
    </Fragment>
  );
};

export default Header;
