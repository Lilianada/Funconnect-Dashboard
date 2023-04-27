import { useState, createContext, useContext } from "react";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("apiToken"));

  const login = (apiToken) => {
    setToken(apiToken);
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
