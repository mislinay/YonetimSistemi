import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createLoan } from '../../services/api';

const LOAN_TYPES = [
  { value: 1, label: 'İhtiyaç Kredisi' },
  { value: 2, label: 'Eğitim Kredisi' },
  { value: 3, label: 'Taşıt Kredisi' },
];

export default function LoanCreate() {
  const { id: customerId } = useParams();
  const navigate = useNavigate();
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

  // Aylık taksit tahmini (canlı hesaplama)
  const calcMonthly = () => {
    const p = parseFloat(form.principalAmount);
    const r = parseFloat(form.profitRate) / 100 / 12;
    const n = parseInt(form.termInMonths);
    if (!p || !r || !n) return null;
    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return payment.toFixed(2);
  };

  const monthly = calcMonthly();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await createLoan({
        ...form,
        principalAmount: parseFloat(form.principalAmount),
        profitRate: parseFloat(form.profitRate),
        termInMonths: parseInt(form.termInMonths),
      });
      navigate(`/loans/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Kredi oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Yeni Kredi</h1>
          <p style={{ color: '#6B7A99', fontSize: 13 }}>
            Müşteri #{customerId} için kredi tanımı oluşturun
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(`/customers/${customerId}`)}>
          ← Geri
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

        {/* Form */}
        <div className="card">
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Kredi Türü</label>
                <select
                  value={form.loanType}
                  onChange={(e) => setForm({ ...form, loanType: parseInt(e.target.value) })}
                >
                  {LOAN_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ana Para (₺)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={form.principalAmount}
                  onChange={(e) => setForm({ ...form, principalAmount: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Yıllık Kar Oranı (%)</label>
                <input
                  type="number"
                  placeholder="24"
                  value={form.profitRate}
                  onChange={(e) => setForm({ ...form, profitRate: e.target.value })}
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Vade (Ay)</label>
                <input
                  type="number"
                  placeholder="12"
                  value={form.termInMonths}
                  onChange={(e) => setForm({ ...form, termInMonths: e.target.value })}
                  min="1"
                  max="360"
                  required
                />
              </div>

              <div className="form-group">
                <label>Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />
              </div>

            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Oluşturuluyor...' : 'Kredi Oluştur'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/customers/${customerId}`)}
              >
                İptal
              </button>
            </div>
          </form>
        </div>

        {/* Canlı Özet */}
        <div>
          <div className="card" style={{ background: '#1B2A4A' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 20 }}>
              KREDİ ÖNİZLEME
            </h3>

            <div style={styles.previewRow}>
              <span style={styles.previewLabel}>Kredi Türü</span>
              <span style={styles.previewValue}>
                {LOAN_TYPES.find(t => t.value === form.loanType)?.label}
              </span>
            </div>

            <div style={styles.previewRow}>
              <span style={styles.previewLabel}>Ana Para</span>
              <span style={styles.previewValue}>
                {form.principalAmount
                  ? parseFloat(form.principalAmount).toLocaleString('tr-TR') + ' ₺'
                  : '—'}
              </span>
            </div>

            <div style={styles.previewRow}>
              <span style={styles.previewLabel}>Kar Payı Oranı</span>
              <span style={styles.previewValue}>
                {form.profitRate ? `%${form.profitRate}` : '—'}
              </span>
            </div>

            <div style={styles.previewRow}>
              <span style={styles.previewLabel}>Vade</span>
              <span style={styles.previewValue}>
                {form.termInMonths ? `${form.termInMonths} ay` : '—'}
              </span>
            </div>

            <div style={styles.divider} />

            <div style={{ textAlign: 'center' }}>
              <div style={styles.monthlyLabel}>Tahmini Aylık Taksit</div>
              <div style={styles.monthlyValue}>
                {monthly
                  ? parseFloat(monthly).toLocaleString('tr-TR') + ' ₺'
                  : '—'}
              </div>
              {monthly && form.termInMonths && (
                <div style={styles.totalNote}>
                  Toplam geri ödeme:{' '}
                  {(parseFloat(monthly) * parseInt(form.termInMonths)).toLocaleString('tr-TR')} ₺
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16, background: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
              ⚠️ Kredi oluşturulduğunda müşterinin kredi skoru otomatik sorgulanır.
              Skor 500'ün altındaysa kredi onaylanmaz.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  error: {
    background: '#FEE2E2', color: '#EF4444',
    padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 20,
  },
  previewRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  previewLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  previewValue: { fontSize: 13, fontWeight: 600, color: '#FFFFFF' },
  divider: { borderTop: '1px solid rgba(255,255,255,0.1)', margin: '20px 0' },
  monthlyLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  monthlyValue: { fontSize: 32, fontWeight: 800, color: '#2E5BFF' },
  totalNote: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 },
};