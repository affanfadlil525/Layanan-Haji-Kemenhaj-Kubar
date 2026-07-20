import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress extension/third-party script injection errors that don't originate from the app
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('Failed to get initial state') ||
      msg.includes('ethereum') ||
      msg.includes('Cannot redefine property')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = (reason && typeof reason === 'object' && 'message' in reason && typeof reason.message === 'string') 
      ? reason.message 
      : (typeof reason === 'string' ? reason : '');
    if (
      msg.includes('Failed to get initial state') ||
      msg.includes('ethereum') ||
      msg.includes('Cannot redefine property')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

