import axios from "axios";

const server = "https://mintfiat.onrender.com";
const local = "http://localhost:5000"

export const api = axios.create({
  baseURL: local,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
