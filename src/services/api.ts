import axios from "axios";

const baseURL = "https://jldev-myblog.onrender.com/api";

const api = axios.create({
  baseURL,
});

export default api;
