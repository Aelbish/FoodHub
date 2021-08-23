import React from "react";

//Create a blueprint of our cart context
const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
  restaurantId: 0,
});

export default CartContext;
