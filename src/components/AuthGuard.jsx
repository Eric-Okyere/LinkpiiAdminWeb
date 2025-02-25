import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Replace with your actual auth check

  return isAuthenticated ? <Outlet /> : <Navigate to="/loginform" replace />;
};

export default AuthGuard;
