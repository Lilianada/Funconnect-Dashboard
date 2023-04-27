import React, { useState } from "react";
import Logo from "../../image/funConnectLogo.png";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";

const LoginEmail = () => {
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP sent successfully
  const [error, setError] = useState(null); // State to track error message
  const [email, setEmail] = useState(''); // State to track email input value

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.'); // Set error state with email validation error message
      return;
    }
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.post(
        'https://api.funconnect.app/auth/login/send-otp',
        { email },
        { headers: { Accept: 'application/json' } }
      );
      console.log(response.data);
      // Save email and request_id in localStorage
      localStorage.setItem('email', email);
      localStorage.setItem('requestId', response.data.data.request_id);
      // Navigate to '/login' after successful OTP sent
      navigate('/login');
      setOtpSent(true); // Set otpSent state to true
    } catch (error) {
      console.error(error);
      setError('Failed to send OTP. Please try again.'); // Set error state with error message
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value); // Update email state with input value
    setError(null); // Reset error state on email input change
  };

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="container">
      <div className="login">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit} className="login__form">
          <input
            type="text"
            className="form__field"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange} // Add email input change handler
          />
          {otpSent && <p className="success__message">OTP sent successfully</p>} {/* Display success message */}
          {error && <p className="error__message">{error}</p>} {/* Display error message */}
          <button type="submit" className="form__button">
            {loading ? 'Loading...' : 'Send Otp'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginEmail;
