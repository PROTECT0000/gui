import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import LoginPage from './features/auth/LoginPage'
import DashboardPage from './features/dashboard/DashboardPage'
import MinersPage from './features/miners/MinersPage'
import MinerDetailPage from './features/miners/MinerDetailPage'
import AlertsPage from './features/alerts/AlertsPage'
import LogsPage from './features/logs/LogsPage'
import CctvsPage from './features/cctv/CctvsPage'
import { Protected } from './features/common/Protected'
import AppLayout from './features/layout/AppLayout'
import MapPage from './features/map/MapPage'

const router = createBrowserRouter([
  { path: '/', element: <LoginPage/> },
  {
    element: <Protected><AppLayout/></Protected>,
    children: [
      { path: '/dashboard', element: <DashboardPage/> },
      { path: '/map', element: <MapPage/> },
      { path: '/miners', element: <MinersPage/> },
      { path: '/miners/:minerId', element: <MinerDetailPage/> },
      { path: '/alerts', element: <AlertsPage/> },
      { path: '/logs', element: <LogsPage/> },
      { path: '/cctvs', element: <CctvsPage/> },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>,
)
