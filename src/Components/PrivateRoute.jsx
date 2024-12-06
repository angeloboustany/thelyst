// src/Components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const PrivateRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading spinner or text
  }

  if (error) {
    console.error(error);
    return <div>Error occurred. Please try again later.</div>;
  }

  // If the user is authenticated, render the children (HomePage or any protected page)
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
