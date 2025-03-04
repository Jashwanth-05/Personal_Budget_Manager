import React, { useEffect, useState } from "react";
import API from "../../axiosInstance";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        await API.post("/verify");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed", error);
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);


  if (isAuthenticated === null) {
    return <h2>Loading...</h2>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
