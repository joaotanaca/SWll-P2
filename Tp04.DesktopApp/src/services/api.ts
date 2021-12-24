import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:39924",
});

export default instance;
