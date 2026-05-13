import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCustomer } from '../services/api';

const pwRules = [
  { label: 'En az 8 karakter',             test: (p) => p.length >= 8 },
  { label: 'En az 1 büyük harf (A-Z)',     test: (p) => /[A-Z]/.test(p) },
  { label: 'En az 1 küçük harf (a-z)',     test: (p) => /[a-z]/.test(p) },
  { label: 'En az 1 rakam (0-9)',          test: (p) => /[0-9]/.test(p) },
  { label: 'En az 1 özel karakter (!@#$)', test: (p) => /[!@#$%^&*]/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', identityNumber: '',
    email: '', phoneNumber: '', password: '',
  });
  const [pwFocus, setPwFocus] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const allValid = pwRules.every((r) => r.test(form.password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.identityNumber.length !== 11) {
      setError('TC Kimlik No 11 haneli olmalıdır.'); return;
    }
    if (!allValid) {
      setError('Şifre güvenlik koşullarını karşılamıyor.'); return;
    }
    setLoading(true);
    try {
      await createCustomer(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const pwCount = pwRules.filter(r => r.test(form.password)).length;
  const strength = pwCount <= 2 ? { label: 'Zayıf', color: '#EF4444' }
                 : pwCount <= 4 ? { label: 'Orta',  color: '#F59E0B' }
                 :                { label: 'Güçlü', color: '#10B981' };

  return (
    <div style={styles.page}>

      {/* Sol Panel */}
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.logoBox}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <h1 style={styles.bankName}>YönetimBank</h1>
          <p style={styles.bankDesc}>Dijital Kredi ve Geri Ödeme Yönetim Sistemi</p>
          <div style={styles.stepList}>
            {['Bilgilerinizi girin', 'Hesabınızı oluşturun', 'Kredi başvurusu yapın'].map((s, i) => (
              <div key={s} style={styles.step}>
                <div style={styles.stepNum}>{i + 1}</div>
                <span style={styles.stepText}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Panel */}
      <div style={styles.right}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Hesap Oluştur</h2>
          <p style={styles.subtitle}>Zaten hesabınız var mı?{' '}
            <Link to="/login" style={styles.link}>Giriş yapın</Link>
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.grid2}>
              <div className="form-group">
                <label>Ad</label>
                <input placeholder="Ahmet" value={form.firstName}
                  onChange={e => setForm({...form, firstName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Soyad</label>
                <input placeholder="Yılmaz" value={form.lastName}
                  onChange={e => setForm({...form, lastName: e.target.value})} required />
              </div>
            </div>

            <div className="form-group">
              <label>TC Kimlik No</label>
              <input placeholder="12345678901" maxLength={11} value={form.identityNumber}
                onChange={e => setForm({...form, identityNumber: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="ornek@email.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Telefon</label>
              <input placeholder="05XX XXX XX XX" value={form.phoneNumber}
                onChange={e => setForm({...form, phoneNumber: e.target.value})} required />
            </div>

            <div className="form-group">
              <label>Şifre</label>
              <input type="password" placeholder="Güvenli şifre"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                onFocus={() => setPwFocus(true)}
                onBlur={() => setPwFocus(false)}
                style={{ borderColor: form.password ? (allValid ? '#10B981' : '#EF4444') : undefined }}
                required
              />
              {(pwFocus || form.password.length > 0) && (
                <div style={styles.pwBox}>
                  {pwRules.map(rule => {
                    const ok = rule.test(form.password);
                    return (
                      <div key={rule.label} style={styles.pwRow}>
                        <div style={{ ...styles.pwDot, background: ok ? '#10B981' : '#E2E8F0' }}>
                          {ok && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                        </div>
                        <span style={{ fontSize: 12, color: ok ? '#10B981' : '#6B7A99' }}>{rule.label}</span>
                      </div>
                    );
                  })}
                  <div style={styles.strengthRow}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        ...styles.strengthSeg,
                        background: pwCount >= i ? strength.color : '#E2E8F0'
                      }} />
                    ))}
                    {form.password && <span style={{ fontSize: 11, fontWeight: 600, color: strength.color, marginLeft: 6 }}>{strength.label}</span>}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    width: 380, background: 'linear-gradient(180deg, #0F1E36, #1B2A4A)',
    display: 'flex', alignItems: 'center', padding: '48px 40px',
  },
  leftInner: {},
  logoBox: {
    width: 48, height: 48, background: '#2E5BFF', borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  bankName: { color: '#FFFFFF', fontSize: 26, fontWeight: 800, marginBottom: 8 },
  bankDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, marginBottom: 36 },
  stepList: { display: 'flex', flexDirection: 'column', gap: 16 },
  step: { display: 'flex', alignItems: 'center', gap: 12 },
  stepNum: {
    width: 28, height: 28, background: '#2E5BFF', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  stepText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#F4F6FB', overflowY: 'auto' },
  formBox: { width: '100%', maxWidth: 440 },
  title: { fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#6B7A99', marginBottom: 24 },
  link: { color: '#2E5BFF', fontWeight: 600, textDecoration: 'none' },
  error: { background: '#FEE2E2', color: '#EF4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  pwBox: { marginTop: 10, padding: '12px 14px', background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 8 },
  pwRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  pwDot: { width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  strengthRow: { display: 'flex', alignItems: 'center', marginTop: 10 },
  strengthSeg: { flex: 1, height: 4, borderRadius: 2, marginRight: 3, transition: 'background 0.3s' },
  submitBtn: {
    width: '100%', padding: '13px', background: '#1B2A4A',
    color: '#FFFFFF', border: 'none', borderRadius: 10,
    fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8,
  },
};