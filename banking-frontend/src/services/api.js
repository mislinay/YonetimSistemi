import axios from 'axios';

// Tüm API isteklerinin base URL'i
// Backend'in çalıştığı adres
const API = axios.create({
  baseURL: 'http://localhost:5039/api',
});


// ─── AUTH ─────────────────────────────────────────────
export const login = (data) => API.post('/auth/login', data);

// ─── CUSTOMERS ───────────────────────────────────────────
export const getCustomers      = ()        => API.get('/customers');
export const getCustomerById   = (id)      => API.get(`/customers/${id}`);
export const createCustomer    = (data)    => API.post('/customers', data);
export const updateCustomer    = (id,data) => API.put(`/customers/${id}`, data);
export const deleteCustomer    = (id)      => API.delete(`/customers/${id}`);
export const getDebtSummary    = (id)      => API.get(`/customers/${id}/debt-summary`);


// Kredi başvurusu (müşteri yapar)
export const applyLoan = (data) => API.post('/loans/apply', data);

// Bekleyen başvurular (admin görür)
export const getPendingLoans = () => API.get('/loans/pending');

// Onayla / Reddet (admin yapar)
export const approveLoan = (id) => API.patch(`/loans/${id}/approve`);
export const rejectLoan  = (id) => API.patch(`/loans/${id}/reject`);

// ─── LOANS ───────────────────────────────────────────────
export const getLoansByCustomer = (customerId) => API.get(`/loans/customer/${customerId}`);
export const getLoanById        = (id)         => API.get(`/loans/${id}`);
export const createLoan         = (data)       => API.post('/loans', data);
export const updateLoanStatus   = (id, status) => API.patch(`/loans/${id}/status`, status);

// ─── INSTALLMENTS ────────────────────────────────────────
export const getInstallmentsByLoan = (loanId) => API.get(`/installments/loan/${loanId}`);

// ─── PAYMENTS ────────────────────────────────────────────
export const createPayment = (data) => API.post('/payments', data);
export const getPaymentById = (id)  => API.get(`/payments/${id}`);