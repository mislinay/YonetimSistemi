import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email ve şifre zorunludur.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(form);
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'Admin') {
        navigate('/app/dashboard');
      } else {
        navigate(`/portal/${user.customerId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </div>
          <span style={styles.bankName}>YönetimBank</span>
        </div>

        <h2 style={styles.title}>Hoş Geldiniz</h2>
        <p style={styles.subtitle}>Devam etmek için giriş yapın</p>

        <form onSubmit={handleSubmit}>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Adresi</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder="ornek@banka.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Şifre</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={styles.input}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <svg width="16" height="16" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F0F4FF',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '0.5px solid #E2E8F0',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
    justifyContent: 'center',
  },
  logoBox: {
    width: 36, height: 36,
    background: '#1B2A4A',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  bankName: {
    fontSize: 16, fontWeight: 700, color: '#1B2A4A',
  },
  title: {
    fontSize: '24px', fontWeight: '700',
    color: '#1B2A4A', marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7A99', fontSize: '14px', marginBottom: '32px',
    textAlign: 'center',
  },
  formGroup: { marginBottom: '20px' },
  label: {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#1B2A4A', marginBottom: '8px',
  },
  inputWrapper: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: '14px',
    top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
  },
  input: {
    width: '100%', padding: '12px 14px 12px 42px',
    border: '1px solid #E2E8F0', borderRadius: '10px',
    fontSize: '14px', color: '#1B2A4A', background: '#FFFFFF',
    outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box',
  },
  error: {
    background: '#FEE2E2', color: '#EF4444',
    padding: '10px 14px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '16px',
  },
  submitBtn: {
    width: '100%', padding: '13px',
    background: '#1B2A4A', color: '#FFFFFF',
    border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', marginTop: '8px',
  },
  eyeIcon: {
    position: 'absolute', right: '14px',
    top: '50%', transform: 'translateY(-50%)',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center',
  },
};