import axios from "axios";

const instance = axios.create({
  baseURL: "https://sp-taskify-api.vercel.app/7-1",
  withCredentials: true,
});

export default instance;
