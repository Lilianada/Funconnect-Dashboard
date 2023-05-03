import React from "react";
import LoginEmail from "./components/Login";
import LoginOtp from "./components/Login/LoginOtp";
import Categories from "./components/Categories";
import Features from "./components/Features";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Places from "./components/Places";
import { AuthProvider } from "./services/auth";
import { RequireAuth } from "./services/requireAuth";
// import Dashboard from './Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route index path="/" element={<LoginEmail />} />
          <Route
            exact
            path="/login"
            element={
                <LoginOtp />
            }
          />
          <Route
            exact
            path="/categories"
            element={
              <RequireAuth>
                <Categories />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/features"
            element={
              <RequireAuth>
                <Features />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/places"
            element={
              <RequireAuth>
                <Places />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
