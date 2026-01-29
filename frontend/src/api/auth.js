import api from "./axios";

export const registerUser = async (payload) => {
  const res = await api.post("/users/register", payload);
  return res.data;
};

export const loginUser = async (payload) => {
  const res = await api.post("/users/login", payload);
  return res.data; // { access_token, user }
};
