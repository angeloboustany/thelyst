import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "The email address is badly formatted.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "The email address is already in use.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const actionCodeSettings = {
    url: "thelyst.web.app",
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        setStatusMessage("Login Successful!");
        setStatusType("success");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setStatusMessage("Please verify your email before logging in.");
        setStatusType("error");
      }
    } catch (error) {
      setStatusMessage(getErrorMessage(error.code));
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user, actionCodeSettings);
      setStatusMessage(
        "Sign up successful! A verification email has been sent. Please verify your email to log in."
      );
      setStatusType("success");
      setEmail("");
      setPassword("");
    } catch (error) {
      setStatusMessage(getErrorMessage(error.code));
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`
                p-4 rounded-md text-center 
                ${statusType === 'success'
                  ? 'bg-green-900 text-green-300'
                  : 'bg-red-900 text-red-300'}
              `}
            >
              {statusMessage}
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
            </div>
          )}

          {/* Input Group */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button Group */}
          <div className="space-y-4">
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
            <button
              type="button"
              className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition duration-300"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Switch to Sign Up" : "Switch to Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;