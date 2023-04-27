import { useAuth } from "./auth";
import { Navigate, useLocation } from "react-router-dom";

export const RequireAuth = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    
    if (!localStorage.getItem("apiToken")) {
        alert("You must be logged in to view this page");
        return <Navigate to="/" state={{ path: location.pathname }} />;
      }
    
    return children;
}
