import api from "./axios";

export const getRequests = () =>
  api.get("/requests/");

export const approveRequest = (id) =>
  api.post(`/requests/${id}/approve`);
