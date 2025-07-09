import React from 'react';
import ReactDOM from 'react-dom/client';
//import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from "./App";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App /> {/* App contiene AppRouter + CSS */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
