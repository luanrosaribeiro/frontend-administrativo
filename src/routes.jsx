import { createBrowserRouter } from "react-router";
import { LoginAdmin } from "./components/Login";
import { Dashboard } from "./pages/ListDashboard";
import { Candidato } from "./pages/ListCandidato";
import { Partido } from "./pages/ListPartido";
import { Cargo } from "./pages/ListCargo";
import { Eleitor } from "./pages/ListEleitor";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginAdmin />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Candidato /> },
      { path: "candidato", element: <Candidato /> },
      { path: "partido", element: <Partido /> },
      { path: "cargo", element: <Cargo /> },
      { path: "eleitor", element: <Eleitor /> },
    ],
  },
]);