import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // change to deployed backend URL on Vercel
});

export default API;
