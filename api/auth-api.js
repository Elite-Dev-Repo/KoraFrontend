import api from "./api";
import { ACCESS, REFRESH } from "./constants";

export const RegisterFunction = async (payload) => {
  try {
    const res = await api.post("register/", payload);
    return res.data;
  } catch (error) {
    // Re-throw normalized backend errors so callers can toast them
    throw error.response?.data ?? { detail: "Something went wrong" };
  }
};

export const LoginFunction = async (payload) => {
  try {
    const res = await api.post("token/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data ?? { detail: "Something went wrong" };
  }
};

export const clearToken = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
};
