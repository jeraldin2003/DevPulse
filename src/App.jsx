import { useAuth } from './context/AuthContext.jsx';
import DevPulseDashboard from "./components/DevPulseDashboard.jsx";
import LoginPage from "./components/LoginPage.jsx";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="pulse" />
        <span>Loading…</span>
      </div>
    );
  }

  return isAuthenticated ? <DevPulseDashboard /> : <LoginPage />;
}
