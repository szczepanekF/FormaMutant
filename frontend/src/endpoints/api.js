import axios from "axios";

const BASE_URL = "http://localhost:8000/api/";
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const AUTH_CHECK_URL = `${BASE_URL}authcheck/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const ADMIN_URL = `${BASE_URL}checkAdmin/`;
const ORDER_ADD_URL = `${BASE_URL}order/`;
const GET_ALL_ORDER = `${BASE_URL}getAllOrders/`;
const CHANGE_ORDER_STATUS = `${BASE_URL}orderChangeState/`;
const GET_ALL_ITEMS = `${BASE_URL}getAllItems/`;
const CHANGE_ITEM_STATE = `${BASE_URL}updateItemState/`;
const GET_ACCOUNT_FOR_ITEM = `${BASE_URL}getAccountForItem/`;
const SET_ITEM_NUMBER = `${BASE_URL}setItemNumber/`;
const GET_ACCOUNT_BY_NUMBER = `${BASE_URL}getAccountForNumber/`;

export const login = async (username, password) => {
  await axios.post(
    LOGIN_URL,
    { username, password },
    { withCredentials: true }
  );

  return true;
};

export const logout = async (username, password) => {
  await axios.post(LOGOUT_URL, {}, { withCredentials: true });

  return true;
};

export const getIsAdmin = async () => {
  const response = await axios.get(ADMIN_URL, { withCredentials: true });
  return response.data.is_admin;
};

export const getAccountForItem = async (token) => {
  const response = await axios.get(`${GET_ACCOUNT_FOR_ITEM}${token}/`, {
    withCredentials: true,
  });
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axios.get(GET_ALL_ORDER, { withCredentials: true });
  return response.data;
};
export const getAllItems = async () => {
  const response = await axios.get(GET_ALL_ITEMS, { withCredentials: true });
  return response.data;
};

export const refresh = async () => {
  await axios.post(REFRESH_URL, {}, { withCredentials: true });
  return true;
};

export const is_auth = async () => {
  const response = await axios.get(AUTH_CHECK_URL, { withCredentials: true });
  return response;
};

export const order_creation = async (user, amount_of_headphones) => {
  const payload = {
    user: user,
    items_count: parseInt(amount_of_headphones),
  };
  const response = await axios.post(ORDER_ADD_URL, payload, {
    withCredentials: false,
  });
  return response;
};

export const change_order_state = async (state, pk) => {
  await axios.post(
    `${CHANGE_ORDER_STATUS}${pk}/`,
    { state },
    { withCredentials: true }
  );

  return true;
};

export const change_item_state = async (state, token) => {
  await axios.patch(
    `${CHANGE_ITEM_STATE}${token}/`,
    { state },
    { withCredentials: true }
  );

  return true;
};

export const set_item_number = async (number, token) => {
  await axios.patch(`${SET_ITEM_NUMBER}${token}/`, number, {
    withCredentials: true,
  });

  return true;
};

export const getAccountByNumber = async (number) => {
  const res = await axios.get(`${GET_ACCOUNT_BY_NUMBER}${number}/`, {
    withCredentials: true,
  });
  return res.data;
};
