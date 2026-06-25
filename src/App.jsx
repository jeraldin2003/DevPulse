import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '~/features/auth/context/AuthContext.jsx';
import { LoginPage } from '~/features/auth/pages/LoginPage.jsx';
import DashboardPage from '~/features/dashboard/pages/DashboardPage.jsx';
import QuizPage from '~/features/quiz/pages/QuizPage.jsx';
import SidebarLayout from '~/components/layout/SidebarLayout.jsx';
import ContactPage from './features/contactform/ContactPage';
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="pulse" />
        <span>Loading…</span>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Route>
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
