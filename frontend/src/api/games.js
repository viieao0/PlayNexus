import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllGames = async () => {
  const res = await axios.get(`${BASE_URL}/games/`, {
    headers: { ...authHeader() },
  });
  return res.data;
};

export const getGameById = async (id) => {
  const res = await axios.get(`${BASE_URL}/games/${id}`, {
    headers: { ...authHeader() },
  });
  return res.data;
};

export const createGame = async (payload) => {
  const res = await axios.post(`${BASE_URL}/games/`, payload, {
    headers: { ...authHeader() },
  });
  return res.data;
};
