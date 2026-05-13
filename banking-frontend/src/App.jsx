import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/Layout';

// Public sayfalar
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

// Admin sayfaları
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/customers/CustomerList';
import CustomerCreate from './pages/customers/CustomerCreate';
import CustomerDetail from './pages/customers/CustomerDetail';
import LoanDetail from './pages/loans/LoanDetail';
import InstallmentList from './pages/installments/InstallmentList';
import DebtSummary from './pages/DebtSummary';

// Portal sayfaları
import CustomerPortal from './pages/portal/CustomerPortal';
import LoanApplication from './pages/portal/LoanApplication';
import PortalInstallments from './pages/portal/PortalInstallments';

// Admin başvuru sayfası
import PendingApplications from './pages/admin/PendingApplications';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC SAYFALAR */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* MÜŞTERİ PORTALI - sidebar yok */}
        <Route path="/portal/:customerId" element={<CustomerPortal />} />
        <Route path="/portal/:customerId/apply" element={<LoanApplication />} />
        <Route
          path="/portal/:customerId/loans/:loanId/installments"
          element={<PortalInstallments />}
        />

        {/* ADMIN PANEL - sidebar var */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* Müşteriler */}
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/new" element={<CustomerCreate />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="customers/:id/debt" element={<DebtSummary />} />

          {/* Krediler */}
          <Route path="loans/:id" element={<LoanDetail />} />
          <Route path="loans/:id/installments" element={<InstallmentList />} />

          {/* Bekleyen kredi başvuruları */}
          <Route path="pending-applications" element={<PendingApplications />} />
        </Route>

        {/* Tanımsız route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;