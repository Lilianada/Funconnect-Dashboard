import React from 'react';
import Logo from '../../image/funConnectLogo.png';
import './style.css';

export default function LoginOtp() {
  return (
    <div className="container">
        <div className="login">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <form action="post" className="login__form">
                    <input type="text" className="form__field" placeholder='Enter Otp' />
                    <button type="submit" className='form__button'>Validate Otp</button>
                </form>
        </div>
    </div>
  )
}
