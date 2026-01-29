import api from "./axios";

export const getReviewsByGame = async (gameId) => {
  const res = await api.get(`/reviews/game/${gameId}`);
  return res.data;
};

export const createReview = async (payload) => {
  const res = await api.post("/reviews/", payload);
  return res.data;
};
