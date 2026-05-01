import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { ListCandidato } from '../pages/ListCandidato';
import { ListPartido } from '../pages/ListPartido';
import { ListCargo } from '../pages/ListCargo';
import { ListEleitor } from '../pages/ListEleitor';
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
    ],
  },
]);