import React from 'react';
import { Routes, Route } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";

/**
 * App Component
 * Defines the client-side routing for the application.
 * The paths here should match the links used in your navigation bar.
 */
function App() {
  return (
    <Routes>
      {/* Route for the Login Page */}
      <Route path="/login" element={<LoginPanel />} />
      
      {/* Route for the Register Page */}
      <Route path="/register" element={<Register />} />
      
      {/* Default Route: 
        If you want the base URL to show the login page by default 
      */}
      <Route path="/" element={<LoginPanel />} />
      
      {/* Catch-all Route: 
        Optionally, you can add a 404 page here if a user enters a wrong URL 
      */}
    </Routes>
  );
}

export default App;