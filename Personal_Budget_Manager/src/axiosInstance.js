import axios from "axios";

const API = axios.create({
  baseURL: "https://personal-budget-manager-backend.onrender.com",
  withCredentials: true,
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  // It's also good practice to ensure the Content-Type is set, though Axios often handles this.
  req.headers['Content-Type'] = 'application/json';
  return req;
});

export default API;


