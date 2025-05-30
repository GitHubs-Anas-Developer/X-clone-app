import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { baseUrl } from "./constant/url";
import "./App.css";

function App() {
  // 🔐 Fetch authenticated user
  const fetchAuthUser = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      console.log("Authenticated user:", data.user);
      return data;
    } catch (error) {
      throw new Error(error.message || "Fetch failed");
    }
  };

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
    retry: false,
  });

  // ⏳ Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        {/* Left Sidebar */}
        {authUser && <Sidebar />}

        {/* Main Routes */}
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:userName"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>

        {/* Right Panel */}
        {authUser && <RightPanel />}
      </div>

      {/* Global Toaster */}
      <Toaster position="top-right" />
    </>
  );
}

export default App;
