import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import Logo from '../../image/funConnectLogo.png';
import axios from 'axios';
import './style.css';

export default function LoginOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Get the history object from react-router-dom

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = e.target[0].value;

    // Retrieve email and requestId from local storage
    const email = localStorage.getItem('email');
    const requestId = localStorage.getItem('requestId');

    if (!email || !requestId) {
      console.error('Email or requestId not found in local storage');
      setError('Email or requestId not found in local storage. Please try again.');
      return;
    }

    // Call sendOtp function with email, otp, and requestId
    sendOtp(email, otp, requestId);
  };

  const sendOtp = async (email, otp, requestId) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://api.funconnect.app/auth/login/otp',
        { email, otp, request_id: requestId },
        { headers: { 'Accept': 'application/json' } }
      );

      console.log(response.data);
      // Check if OTP verification was successful
      if (response.data.message === 'OK') {
        console.log('Login successful');
        navigate('/dashboard'); 
      } else {
        setError('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to verify OTP. Please try again.');
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
