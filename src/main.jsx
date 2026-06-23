import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from '~/features/auth/context/AuthContext.jsx';
import { ThemeProvider } from '~/features/auth/context/ThemeContext.jsx';
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </AuthProvider>
);
