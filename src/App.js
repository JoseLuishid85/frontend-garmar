// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompaniesPage from './pages/CompaniesPage';
import DebtsPage from './pages/DebtsPage';
import DebtSummaryPage from './pages/DebtSummaryPage';

import ReportDayCreatePage from './pages/ReportDayCreatePage';
import ReportDayListPage from './pages/ReportDayListPage';


function App() {
  return (
    <AuthProvider>
      <SidebarProvider> {/* 👈 Envuelve aquí */}
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Sidebar /> {/* 👈 Sidebar aquí */}
                  <div style={{ paddingTop: '30px' }}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/companies" element={<CompaniesPage />} />
                      <Route path="/debts" element={<DebtsPage />} />
                      <Route path="/debts/company/:companyId/summary" element={<DebtSummaryPage />} />

                      <Route path="/reports" element={<ReportDayListPage />} />
                      <Route path="/reports/create" element={<ReportDayCreatePage />} />
                      <Route path="*" element={<Dashboard />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;