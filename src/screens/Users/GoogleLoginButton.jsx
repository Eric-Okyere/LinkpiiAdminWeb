import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import baseURL from '../../assets/baseURL';

// `agreeToTerms` is optional and only meaningful the first time this
// creates a brand-new account (see googleSignIn in controllers/user.js) -
// pages without a terms checkbox (e.g. Login) can omit it.
const GoogleLoginButton = ({ onLoginSuccess, agreeToTerms, latitude, longitude }) => {


  const handleSuccess = (credentialResponse) => {
    console.log("Google Credential Response:", credentialResponse);
    const token = credentialResponse.credential;

    if (!token) {
      console.error("No token received from Google.");
      return;
    }

    fetch(`${baseURL}auth/google-signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, agreeToTerms, latitude, longitude })
     
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend Response:", data);
        if (data.success) {
            console.log("User Info:", data.user);
          onLoginSuccess(data.user, data.token);
        } else {
          console.error("Login failed:", data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleFailure = (error) => {
    console.error("Google Sign-In failed:", error);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 shadow-soft transition-shadow hover:shadow-card">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
        theme="outline"
        shape="pill"
        size="large"
        text="continue_with"
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleLoginButton;