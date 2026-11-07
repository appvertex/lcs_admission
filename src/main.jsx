import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import App from './App.jsx';
import './styles.css';

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
createRoot(document.getElementById('root')).render(
  key && !key.includes('replace_me')
    ? <ClerkProvider publishableKey={key}><App /></ClerkProvider>
    : <App />
);
