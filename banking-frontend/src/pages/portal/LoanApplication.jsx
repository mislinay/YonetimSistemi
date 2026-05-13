import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { applyLoan } from '../../services/api';

const LOAN_TYPES = [
  { value: 1, label: 'İhtiyaç Kredisi', desc: 'Günlük ihtiyaçlarınız için' },
  { value: 2, label: 'Eğitim Kredisi',  desc: 'Eğitim masraflarınız için' },
  { value: 3, label: 'Taşıt Kredisi',   desc: 'Araç alımı için' },
];

export default function LoanApplication() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    customerId: parseInt(customerId),
    loanType: 1,
    principalAmount: '',
    profitRate: '',
    termInMonths: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Canlı taksit hesaplama
  const calcMonthly = () => {
    const p = parseFloat(form.principalAmount);
    const r = parseFloat(form.profitRate) / 100 / 12;
    const n = parseInt(form.termInMonths);
    if (!p || !r || !n) return null;
    return ((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)).toFixed(2);
  };

  const monthly = calcMonthly();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await applyLoan({
        ...form,
        principalAmount: parseFloat(form.principalAmount),
        profitRate: parseFloat(form.profitRate),
        termInMonths: parseInt(form.termInMonths),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Başvuru gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  // Başvuru başarılı ekranı
  if (success) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <div style={styles.navLogo}>
            <div style={styles.navIcon}>
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <span style={styles.navName}>YönetimBank</span>
          </div>
        </nav>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Başvurunuz Alındı!</h2>
          <p style={styles.successDesc}>
            Kredi başvurunuz admin onayına gönderildi.
            Onaylandığında taksit planınız otomatik oluşturulacak.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/portal/${customerId}`)}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.navIcon}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <span style={styles.navName}>YönetimBank</span>
        </div>
        <button style={styles.backBtn} onClick={() => navigate(`/portal/${customerId}`)}>
          ← Geri Dön
        </button>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Kredi Başvurusu</h1>
        <p style={styles.pageSub}>Başvurunuz admin onayına gönderilecektir.</p>

        <div style={styles.grid}>

          {/* Form */}
          <div style={styles.card}>

            {/* Kredi Türü Seçimi */}
            <div style={{ marginBottom: 24 }}>
              <label style={styles.label}>Kredi Türü</label>
              <div style={styles.typeGrid}>
                {LOAN_TYPES.map(t => (
                  <div
                    key={t.value}
                    style={{
                      ...styles.typeCard,
                      ...(form.loanType === t.value ? styles.typeCardActive : {}),
                    }}
                    onClick={() => setForm({ ...form, loanType: t.value })}
                  >
                    <div style={styles.typeLabel}>{t.label}</div>
                    <div style={styles.typeDesc}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div className="form-group">
                  <label>Ana Para (₺)</label>
                  <input
                    type="number" placeholder="50000" min="1000"
                    value={form.principalAmount}
                    onChange={e => setForm({ ...form, principalAmount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Yıllık Kar Payı Oranı (%)</label>
                  <input
                    type="number" placeholder="24" step="0.01" min="0.01"
                    value={form.profitRate}
                    onChange={e => setForm({ ...form, profitRate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Vade (Ay)</label>
                  <input
                    type="number" placeholder="12" min="1" max="360"
                    value={form.termInMonths}
                    onChange={e => setForm({ ...form, termInMonths: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Başlangıç Tarihi</label>
                  <input
                    type="date" value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: 14, marginTop: 8, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
              </button>
            </form>
          </div>

          {/* Önizleme */}
          <div>
            <div style={styles.previewCard}>
              <h3 style={styles.previewTitle}>KREDİ ÖNİZLEME</h3>

              {[
                { label: 'Kredi Türü',  value: LOAN_TYPES.find(t => t.value === form.loanType)?.label },
                { label: 'Ana Para',    value: form.principalAmount ? parseFloat(form.principalAmount).toLocaleString('tr-TR') + ' ₺' : '—' },
                { label: 'Kar Payı Oranı', value: form.profitRate ? `%${form.profitRate}` : '—' },
                { label: 'Vade',       value: form.termInMonths ? `${form.termInMonths} Ay` : '—' },
              ].map(row => (
                <div key={row.label} style={styles.previewRow}>
                  <span style={styles.previewLabel}>{row.label}</span>
                  <span style={styles.previewValue}>{row.value}</span>
                </div>
              ))}

              <div style={styles.divider} />

              <div style={{ textAlign: 'center' }}>
                <div style={styles.monthlyLabel}>Tahmini Aylık Taksit</div>
                <div style={styles.monthlyValue}>
                  {monthly ? parseFloat(monthly).toLocaleString('tr-TR') + ' ₺' : '—'}
                </div>
                {monthly && form.termInMonths && (
                  <div style={styles.totalNote}>
                    Toplam: {(parseFloat(monthly) * parseInt(form.termInMonths)).toLocaleString('tr-TR')} ₺
                  </div>
                )}
              </div>
            </div>

            <div style={styles.infoBox}>
              <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
                ⚠️ Başvurunuz admin onayına gönderilir. Onaylandıktan sonra
                taksit planınız otomatik oluşturulur ve ödemeler başlar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F4F6FB' },
  nav: {
    background: '#1B2A4A', height: 64,
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 40px',
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  navIcon: {
    width: 34, height: 34, background: '#2E5BFF',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  navName: { color: '#FFFFFF', fontWeight: 700, fontSize: 16 },
  backBtn: {
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8, color: '#FFFFFF', fontSize: 13, cursor: 'pointer', padding: '8px 16px',
  },
  content: { padding: '40px', maxWidth: 1000, margin: '0 auto' },
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 },
  pageSub: { color: '#6B7A99', fontSize: 14, marginBottom: 28 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 },
  card: { background: '#FFFFFF', borderRadius: 12, padding: 28, border: '1px solid #E2E8F0' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 10 },
  typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 },
  typeCard: {
    padding: '14px 12px', border: '2px solid #E2E8F0',
    borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
  },
  typeCardActive: { border: '2px solid #2E5BFF', background: '#EEF2FF' },
  typeLabel: { fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 },
  typeDesc: { fontSize: 11, color: '#6B7A99' },
  error: { background: '#FEE2E2', color: '#EF4444', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  previewCard: {
    background: '#1B2A4A', borderRadius: 12, padding: 24, marginBottom: 16,
  },
  previewTitle: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 20 },
  previewRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  previewLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  previewValue: { fontSize: 13, fontWeight: 600, color: '#FFFFFF' },
  divider: { borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0' },
  monthlyLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  monthlyValue: { fontSize: 28, fontWeight: 800, color: '#2E5BFF' },
  totalNote: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 },
  infoBox: { background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 10, padding: 14 },
  successBox: { maxWidth: 480, margin: '100px auto', textAlign: 'center', background: '#FFFFFF', borderRadius: 16, padding: 48, border: '1px solid #E2E8F0' },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 12 },
  successDesc: { color: '#6B7A99', fontSize: 14, lineHeight: 1.7, marginBottom: 24 },
};