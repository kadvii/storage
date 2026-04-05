import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AddItemPage from './pages/AddItemPage'
import DashboardPage from './pages/DashboardPage'
import AllItemsPage from './pages/AllItemsPage'
import HistoryPage from './pages/HistoryPage'
import AddEmployeePage from './pages/AddEmployeePage'
import EmployeesListPage from './pages/EmployeesListPage'
import DispatchItemPage from './pages/DispatchItemPage'

import LoginPage from './pages/LoginPage'

/**
 * Application routes:
 * - /login          public
 * - /dashboard etc. protected + main layout (sidebar)
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="all-items" element={<AllItemsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="add-item" element={<AddItemPage />} />
        <Route path="dispatch-item" element={<DispatchItemPage />} />
        <Route path="add-employee" element={<AddEmployeePage />} />
        <Route path="employees" element={<EmployeesListPage />} />

      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
