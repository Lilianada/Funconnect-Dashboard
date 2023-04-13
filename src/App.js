import LoginEmail from "./components/Login";
import LoginOtp from "./components/Login/otp";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from './Dashboard';

function App() {
    return (
      <Router>
        <Routes>
          <Route index path="/" element={<LoginEmail/>} />
          <Route exact path="/login" component={<LoginOtp/>} />
          {/* <Route exact path="/dashboard" component={Dashboard} /> */}
          {/* <Route index element={<Navigate to="/" />} /> */}
          {/* <Route path="*" element path="sendOtp" component={LoginEmail} /> */}
        </Routes>
      </Router>
    );
  };

export default App;
