import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/", // Substitua pela URL da sua API
});

export default api;
