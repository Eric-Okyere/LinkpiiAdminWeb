import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import baseURL from '../../assets/baseURL';

const GoogleLoginButton = ({ onLoginSuccess }) => {


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
      body: JSON.stringify({ token })
     
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
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleFailure}
    />
  );
};

export default GoogleLoginButton;
