import axios from "axios";

const server = "https://mintfiat.onrender.com";

export const api = axios.create({
  baseURL: server,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});
