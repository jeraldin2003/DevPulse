import { useAuth } from './context/AuthContext.jsx';
import DevPulseDashboard from "./components/DevPulseDashboard.jsx";
import LoginPage from "./components/LoginPage.jsx";
import Login from './components/LoginPageTest.jsx';
import Dashboard from './components/DevPulseDashboardTest.jsx'
import {useState} from 'react'

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


// export default function App(){
//   const [isAuthenticated, setIsAuthenticated] = useState("login");
//   return(
//     <>
//       {isAuthenticated === "login" && (<Login setIsAuthenticated = {setIsAuthenticated}/>)}
//       {isAuthenticated === "dashboard" && (<Dashboard setIsAuthenticated = {setIsAuthenticated}/>)}
//     </>
//   )
// }

