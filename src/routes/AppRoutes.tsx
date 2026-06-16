import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { ListCandidato } from '../pages/Candidato/List';
import { ListPartido } from '../pages/Partido/List';
import { ListCargo } from '../pages/Cargo/List';
import { ListEleitor } from '../pages/Eleitor/List';
import { ListMesario } from '../pages/Mesario/List';
import { ListSecaoEleitoral } from '../pages/SecaoEleitoral/List';
import { ListUrna } from '../pages/Urna/List';
import { ListUsuario } from '../pages/Usuario/List';
import { ListZonaEleitoral } from '../pages/ZonaEleitoral/List';
import { ListResultado } from '../pages/Resultado/List';
import { PrivateRoute } from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/candidato" replace />,
      },
      { path: 'candidato', element: <ListCandidato /> },
      { path: 'partido', element: <ListPartido /> },
      { path: 'cargo', element: <ListCargo /> },
      { path: 'eleitor', element: <ListEleitor /> },
      { path: 'mesario', element: <ListMesario /> },
      { path: 'secao-eleitoral', element: <ListSecaoEleitoral /> },
      { path: 'zona-eleitoral', element: <ListZonaEleitoral /> },
      { path: 'urna', element: <ListUrna /> },
      { path: 'resultados', element: <ListResultado /> },
      { path: 'usuario', element: <ListUsuario /> },
    ],
  },
]);
