import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
// import logo from "./logo.svg";
import "./App.css";
import Cart from "./components/Cart/Cart";
import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import SearchRestaurantForm from "./components/SearchRestaurant/SearchRestaurantForm";
import CartProvider from "./store/CartProvider";
import Restaurants from "./pages/Restaurants/Restaurants";
import Restaurant from "./pages/Restaurants/Restaurant";
import UserLogin from "./pages/Users/UserLogin";
import UserSignUp from "./pages/Users/UserSignUp";
import UserDetail from "./pages/Users/UserDetail";

function App() {
  const [cartIsShown, setCartItShown] = useState(false);
  const showCartHandler = () => {
    setCartItShown(true);
  };

  const hideCartHandler = () => {
    setCartItShown(false);
  };

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <CartProvider>
      {cartIsShown && <Cart onClose={hideCartHandler} />}
      <Header onShowCart={showCartHandler} />
      <main>
        <Route exact path="/">
          <SearchRestaurantForm />
          <Meals />
        </Route>
        <Switch>
          <Route path="/restaurants/:id">
            <Restaurant />
          </Route>
          <Route path="/restaurants">
            <Restaurants />
          </Route>
          <Route path="/login">
            <UserLogin />
            <Meals />
          </Route>
          <Route path="/register">
            <UserSignUp />
            <Meals />
          </Route>
          <Route path="/user">
            <UserDetail />
          </Route>
        </Switch>
      </main>
    </CartProvider>
  );
}

export default App;
