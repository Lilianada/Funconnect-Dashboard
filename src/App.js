import React from 'react';
import LoginEmail from "./components/Login";
import LoginOtp from "./components/Login/otp";
import Categories from "./components/Categories";
import Features from "./components/Features";
import Places from './components/Places';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
      <Router>
        <Routes>
          <Route index path="/" element={<LoginEmail/>} />
          <Route exact path="/login" element={<LoginOtp/>} />
          <Route exact path="/categories" element={<Categories/>} />
          <Route exact path="/features" element={<Features />} />
          <Route exact path="/places" element={<Places />} />
        </Routes>
      </Router>
    );
  };

export default App;
