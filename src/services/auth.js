import { useState, createContext, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("apiToken"));

  const login = (apiToken) => {
    if (apiToken) {
      localStorage.setItem("apiToken", apiToken);
      setToken(apiToken);
    } else {
      localStorage.removeItem("apiToken");
      setToken(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("apiToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const RequireAuth = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    alert("You must be logged in to view this page");
    return <Navigate to="/" state={{ path: location.pathname }} />;
  }

  return children;
};