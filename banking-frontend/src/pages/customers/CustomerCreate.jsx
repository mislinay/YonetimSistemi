import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../../services/api';

export default function CustomerCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    identityNumber: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [pwFocus, setPwFocus] = useState(false);

  const pwRules = [
    {
      label: 'En az 8 karakter',
      test: (p) => p.length >= 8,
    },
    {
      label: 'En az 1 büyük harf (A-Z)',
      test: (p) => /[A-Z]/.test(p),
    },
    {
      label: 'En az 1 küçük harf (a-z)',
      test: (p) => /[a-z]/.test(p),
    },
    {
      label: 'En az 1 rakam (0-9)',
      test: (p) => /[0-9]/.test(p),
    },
    {
      label: 'En az 1 özel karakter (!@#$.;)',
      test: (p) => /[!@#$%^&*.;]/.test(p),
    },
  ];

  const allValid = pwRules.every((r) => r.test(form.password));

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'identityNumber' || name === 'phoneNumber') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 11);
      setForm({ ...form, [name]: onlyDigits });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasyonlar
    if (form.identityNumber.length !== 11) {
      setError('TC Kimlik No 11 haneli olmalıdır.');
      return;
    }

    if (form.phoneNumber.length !== 11) {
      setError('Telefon numarası 11 haneli olmalıdır.');
      return;
    }

    if (!allValid) {
      setError('Şifre güvenlik koşullarını karşılamıyor.');
      return;
    }

    setLoading(true);

    try {
      const res = await createCustomer(form);
      navigate(`/app/customers/${res.data.id}`);
    } catch (err) {
      console.error('CREATE CUSTOMER ERROR:', err);
      console.error('API RESPONSE:', err.response?.data);

      const apiError =
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.response?.data?.error ||
        JSON.stringify(err.response?.data) ||
        err.message ||
        'Müşteri oluşturulamadı.';

      setError(apiError);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Başlık */}
      <div className="flex-between mb-6">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>
            Yeni Müşteri
          </h1>
          <p style={{ color: '#6B7A99', fontSize: 13 }}>
            Sisteme yeni bireysel müşteri ekleyin
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate('/app/customers')}
        >
          ← Geri
        </button>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        {error && (
          <div style={styles.error}>
            {error.includes(':') ? error.split(':').slice(1).join(':').split('\\r\\n')[0].trim() : error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Ad</label>
              <input
                name="firstName"
                placeholder="Ahmet"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Soyad</label>
              <input
                name="lastName"
                placeholder="Yılmaz"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>TC Kimlik No</label>
              <input
                name="identityNumber"
                placeholder="12345678901"
                value={form.identityNumber}
                onChange={handleChange}
                maxLength={11}
                required
              />
            </div>

            <div className="form-group">
              <label>Telefon</label>
              <input
                name="phoneNumber"
                type="text"
                placeholder="05551234567"
                value={form.phoneNumber}
                onChange={handleChange}
                maxLength={11}
                inputMode="numeric"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="ornek@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Şifre</label>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="En az 6 karakter"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ paddingRight: '42px' }}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '14px',
                      top: '50%', transform: 'translateY(-50%)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                    }}
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

              {(pwFocus || form.password.length > 0) && (
                <div style={styles.pwRules}>
                  <div style={styles.pwRulesTitle}>
                    Şifre Güvenlik Gereksinimleri
                  </div>

                  {pwRules.map((rule) => {
                    const ok = rule.test(form.password);

                    return (
                      <div key={rule.label} style={styles.pwRule}>
                        <div
                          style={{
                            ...styles.pwDot,
                            background: ok ? '#22C55E' : '#E5E7EB',
                          }}
                        >
                          {ok && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                            >
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                          )}
                        </div>

                        <span
                          style={{
                            ...styles.pwLabel,
                            color: ok ? '#16A34A' : '#6B7A99',
                          }}
                        >
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}

                  <div style={styles.strengthBar}>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const passed = pwRules.filter((r) =>
                        r.test(form.password)
                      ).length;

                      const color =
                        passed >= i
                          ? passed <= 2
                            ? '#EF4444'
                            : passed <= 4
                              ? '#F59E0B'
                              : '#22C55E'
                          : '#E5E7EB';

                      return (
                        <div
                          key={i}
                          style={{
                            ...styles.strengthSegment,
                            background: color,
                          }}
                        />
                      );
                    })}

                    <span style={styles.strengthLabel}>
                      {(() => {
                        const passed = pwRules.filter((r) =>
                          r.test(form.password)
                        ).length;

                        if (passed === 0) return '';
                        if (passed <= 2) return 'Zayıf';
                        if (passed <= 4) return 'Orta';
                        return 'Güçlü';
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Müşteri Oluştur'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/app/customers')}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  error: {
    background: '#FEE2E2',
    color: '#EF4444',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
  },

  pwRules: {
    marginTop: 10,
    padding: '14px 16px',
    background: '#F8FAFF',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
  },

  pwRulesTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#6B7A99',
    letterSpacing: '0.06em',
    marginBottom: 10,
  },

  pwRule: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },

  pwDot: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s',
  },

  pwLabel: {
    fontSize: 12,
    transition: 'color 0.2s',
  },

  strengthBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },

  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    transition: 'background 0.3s',
  },

  strengthLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#6B7A99',
    marginLeft: 4,
    minWidth: 30,
  },
};