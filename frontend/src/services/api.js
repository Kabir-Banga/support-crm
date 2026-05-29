import axios from "axios";

const API = axios.create({
  baseURL: "https://crm-backend-0ht9.onrender.com/api",
});

export default API;