import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getFields() {
    return apiClient.get("/fields");
  },
  getItems() {
    return apiClient.get("/items");
  }
};
