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

export const getAllOrders = async () => {
  const response = await axios.get(GET_ALL_ORDER, { withCredentials: true });
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

export const order_creation = async (user,amount_of_headphones) => {
  const payload = {
    user: user,
    amount_of_items: parseInt(amount_of_headphones),
  };
  const response = await axios.post(ORDER_ADD_URL,payload,{withCredentials: false});
  return response
}


export const change_order_state = async (state,pk) => {
  await axios.post(`${CHANGE_ORDER_STATUS}${pk}/`, { state }, { withCredentials: true });

  return true;
};