import axios from "axios";

const server = "https://mintfiat-db.onrender.com";
const local = "http://localhost:5000"

export const api = axios.create({
  baseURL: server,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
