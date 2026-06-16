import { Navigate, useLocation } from "react-router-dom";

function possuiSessaoAtiva() {
  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return false;
  }

  return true;
}

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!possuiSessaoAtiva()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
