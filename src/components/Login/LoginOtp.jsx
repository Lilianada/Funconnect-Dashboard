import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../image/funConnectLogo.png";
import axios from "axios";
import { useAuth } from "../../services/auth";
import "./style.css";

export default function LoginOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/categories";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = e.target[0].value;

    // Retrieve email and requestId from local storage
    const email = localStorage.getItem("email");
    const requestId = localStorage.getItem("requestId");

    if (!email || !requestId) {
      console.error("Email or requestId not found in local storage");
      setError(
        "Email or requestId not found in local storage. Please try again."
      );
      return;
    }

    // Call login function with email, otp, and requestId
    login(email, otp, requestId);
  };

  const login = async (email, otp, requestId) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://api.funconnect.app/auth/login/otp",
        { email, otp, request_id: requestId },
        { headers: { Accept: "application/json" } }
      );
      // Check if OTP verification was successful
      if (response.data.message === "OK") {
        alert("Login successful");
        // Save token in localStorage
        const apiToken = response.data.data.api_token;
        const oldApiToken = localStorage.getItem("apiToken");
        
        // Check if there's an existing apiToken in the storage
        if (oldApiToken) {
          localStorage.removeItem("apiToken");
        }
        
        localStorage.setItem("apiToken", apiToken);
        setToken(apiToken);
        
        auth.login(apiToken);
        navigate(redirectPath, { replace: true });
      } else {
        setError("Incorrect OTP. Please try again.");
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <div className="login">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit} className="login__form">
          <input type="text" className="form__field" placeholder="Enter OTP" />
          {error && <p className="error__message">{error}</p>}
          <button type="submit" className="form__button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
