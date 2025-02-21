import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './Redux/store.js'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
  <GoogleOAuthProvider clientId="450195054535-tbf14l0n9dhvjon1ili187agq5bcf89k.apps.googleusercontent.com">
  <App />
  </GoogleOAuthProvider>
  </Provider>

  </BrowserRouter>
    
  
)
