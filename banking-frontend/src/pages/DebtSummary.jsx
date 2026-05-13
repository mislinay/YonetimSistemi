import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDebtSummary } from '../services/api';

export default function DebtSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDebtSummary(id)
      .then((res) => setSummary(res.data))
      .catch(() => setError('Borç özeti yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.center}>Yükleniyor...</div>;
  if (error)   return <div style={styles.center}>{error}</div>;

  const statusBadge = (status) => {
    if (status === 'Odendi')   return { cls: 'badge badge-success', label: 'Ödendi' };
    if (status === 'Gecikmis') return { cls: 'badge badge-danger',  label: 'Gecikmiş' };
    return                            { cls: 'badge badge-warning', label: 'Ödenmedi' };
  };

  return (
    <div>
      {/* Başlık */}
      <div className="flex-between mb-6">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Borç Özeti</h1>
          <p style={{ color: '#6B7A99', fontSize: 13 }}>
            {summary.fullName} · Müşteri #{summary.customerId}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(`/customers/${id}`)}>
          ← Müşteriye Dön
        </button>
      </div>

      {/* Özet Kartlar */}
      <div style={styles.topGrid}>
        <div style={{ ...styles.bigCard, background: 'linear-gradient(135deg, #1B2A4A, #2A3F6F)' }}>
          <div style={styles.bigLabel}>Toplam Borç</div>
          <div style={styles.bigValue}>
            {summary.totalDebt.toLocaleString('tr-TR')} ₺
          </div>
          <div style={styles.bigSub}>Tüm ödenmemiş taksitler</div>
        </div>

        <div style={styles.rightCards}>
          <div className="card" style={styles.miniCard}>
            <div style={styles.miniLabel}>Kalan Anapara</div>
            <div style={{ ...styles.miniValue, color: '#2E5BFF' }}>
              {summary.remainingPrincipal.toLocaleString('tr-TR')} ₺
            </div>
          </div>
          <div className="card" style={styles.miniCard}>
            <div style={styles.miniLabel}>Gecikmiş Taksit</div>
            <div style={{ ...styles.miniValue, color: '#EF4444' }}>
              {summary.overdueInstallmentCount} Adet
            </div>
          </div>
          <div className="card" style={styles.miniCard}>
            <div style={styles.miniLabel}>Ödenen Taksit</div>
            <div style={{ ...styles.miniValue, color: '#10B981' }}>
              {summary.paidInstallments.length} Adet
            </div>
          </div>
          <div className="card" style={styles.miniCard}>
            <div style={styles.miniLabel}>Ödenmeyen Taksit</div>
            <div style={{ ...styles.miniValue, color: '#F59E0B' }}>
              {summary.unpaidInstallments.length} Adet
            </div>
          </div>
        </div>
      </div>

      {/* Ödenmeyen Taksitler */}
      <div className="card mb-6">
        <h2 style={styles.cardTitle}>
          Ödenmeyen Taksitler
          <span style={styles.countBadge}>{summary.unpaidInstallments.length}</span>
        </h2>
        {summary.unpaidInstallments.length === 0 ? (
          <div style={styles.empty}>🎉 Tüm taksitler ödenmiş!</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Taksit No</th>
                  <th>Tutar</th>
                  <th>Son Ödeme Tarihi</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {summary.unpaidInstallments.map((inst) => {
                  const badge = statusBadge(inst.status);
                  return (
                    <tr key={inst.id}>
                      <td style={{ fontWeight: 700 }}>#{inst.installmentNumber}</td>
                      <td style={{ fontWeight: 600, color: '#EF4444' }}>
                        {inst.amount.toLocaleString('tr-TR')} ₺
                      </td>
                      <td>{new Date(inst.dueDate).toLocaleDateString('tr-TR')}</td>
                      <td><span className={badge.cls}>{badge.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ödenen Taksitler */}
      <div className="card">
        <h2 style={styles.cardTitle}>
          Ödenen Taksitler
          <span style={{ ...styles.countBadge, background: '#D1FAE5', color: '#10B981' }}>
            {summary.paidInstallments.length}
          </span>
        </h2>
        {summary.paidInstallments.length === 0 ? (
          <div style={styles.empty}>Henüz ödenen taksit bulunmuyor.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Taksit No</th>
                  <th>Tutar</th>
                  <th>Son Ödeme Tarihi</th>
                  <th>Ödeme Tarihi</th>
                  <th>Referans</th>
                </tr>
              </thead>
              <tbody>
                {summary.paidInstallments.map((inst) => (
                  <tr key={inst.id}>
                    <td style={{ fontWeight: 700 }}>#{inst.installmentNumber}</td>
                    <td style={{ fontWeight: 600, color: '#10B981' }}>
                      {inst.amount.toLocaleString('tr-TR')} ₺
                    </td>
                    <td>{new Date(inst.dueDate).toLocaleDateString('tr-TR')}</td>
                    <td>
                      {inst.payment
                        ? new Date(inst.payment.paymentDate).toLocaleDateString('tr-TR')
                        : '—'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B7A99' }}>
                      {inst.payment?.transactionReference ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  center: { textAlign: 'center', padding: 48, color: '#6B7A99' },
  topGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 },
  bigCard: {
    borderRadius: 12, padding: 32,
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  bigLabel: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 12 },
  bigValue: { fontSize: 42, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 },
  bigSub:   { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  rightCards: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  miniCard:  { padding: 20 },
  miniLabel: { fontSize: 12, color: '#6B7A99', marginBottom: 8 },
  miniValue: { fontSize: 22, fontWeight: 800 },
  cardTitle: {
    fontSize: 15, fontWeight: 700, color: '#1B2A4A',
    marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
  },
  countBadge: {
    background: '#FEE2E2', color: '#EF4444',
    fontSize: 12, fontWeight: 700,
    padding: '2px 10px', borderRadius: 20,
  },
  empty: { textAlign: 'center', padding: 32, color: '#6B7A99', fontSize: 14 },
};