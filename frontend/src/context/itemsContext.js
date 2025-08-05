import React, { createContext, useContext, useState } from "react";
import {
  getAllItems,
  getAccountForItem,
  getAccountByNumber,
} from "../endpoints/api";
import { useAuth } from "./auth";
import { useOrdersContext } from "../context/ordersContext";

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const { orders } = useOrdersContext();

  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const items = await getAllItems();
    setItems(items);
  };

  const getAccountByItem = async (token) => {
    let account;
    const item = items.find(
      (item) => item.token === token && item.state === "zarezerwowane"
    );
    if (!item) {
      return await getAccountForItem(token);
    }
    //TODO check if order is in correct state

    const order = orders.find((order) => order.id === item.order);
    if (!order) {
      return await getAccountForItem(token);
    }

    account = order.account;

    return account;
  };

  const updateItemStateByToken = (token, new_state) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.token === token ? { ...item, state: new_state } : item
      )
    );
  };

  const getAccountForNumber = async (number) => {
    let account;

    const item = items.find(
      (item) => item.item_real_ID === number && item.state === "wydane"
    );
    if (!item) {
      return await getAccountByNumber(number);
    }

    const order = orders.find((order) => order.id === item.order);
    if (!order) {
      return await getAccountByNumber(number);
    }
    account = order.account;
    account.token = item.token;
    return account;
  };

  const fields = {
    items,
    setItems,
    loadItems,
    getAccountByItem,
    getAccountForNumber,
    updateItemStateByToken,
  };

  return (
    <ItemsContext.Provider value={fields}>{children}</ItemsContext.Provider>
  );
};

export const useItemsContext = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItemsContext must be used within an ItemsProvider");
  }
  return context;
};
