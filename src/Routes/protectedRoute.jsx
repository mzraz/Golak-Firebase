import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ token, redirectPath = "/landing", children }) => {
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
