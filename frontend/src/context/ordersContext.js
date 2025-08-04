import React, { createContext, useContext, useState } from "react";
import { getAllOrders } from "../endpoints/api";
import { useAuth } from "./auth";
const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const orders = await getAllOrders();
    setOrders(orders);
  };

  const fields = {
    orders,
    setOrders,
    loadOrders,
  };

  return (
    <OrdersContext.Provider value={fields}>{children}</OrdersContext.Provider>
  );
};

export const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrdersContext must be used within an OrdersProvider");
  }
  return context;
};
