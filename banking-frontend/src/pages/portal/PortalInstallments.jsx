import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInstallmentsByLoan, getLoanById, createPayment } from '../../services/api';

export default function PortalInstallments() {
  const { customerId, loanId } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, [loanId]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getLoanById(loanId), getInstallmentsByLoan(loanId)])
      .then(([lRes, iRes]) => { setLoan(lRes.data); setInstallments(iRes.data); })
      .catch(() => setError('Veriler yüklenemedi.'))
      .finally(() => setLoading(false));
  };

  const handlePay = async (inst) => {
    setPayingId(inst.id);
    setSuccess(''); setError('');
    try {
      await createPayment({ installmentId: inst.id, amountPaid: inst.amount });
      setSuccess(`${inst.installmentNumber}. taksit başarıyla ödendi!`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Ödeme başarısız.');
    } finally {
      setPayingId(null);
    }
  };

  const paid     = installments.filter(i => i.status === 'Odendi').length;
  const total    = installments.length;
  const remaining = installments.filter(i => i.status !== 'Odendi').reduce((s, i) => s + i.amount, 0);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>Yükleniyor...</div>;

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
        <button style={styles.backBtn} onClick={() => navigate(`/portal/${customerId}`)}>
          ← Ana Sayfaya Dön
        </button>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Taksit Planı</h1>
        <p style={styles.pageSub}>{loan?.loanType} Kredisi · {total} taksit</p>

        {success && <div style={styles.success}>{success}</div>}
        {error   && <div style={styles.error}>{error}</div>}

        {/* Özet */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Ödenen</div>
            <div style={{ ...styles.summaryVal, color: '#10B981' }}>{paid} / {total}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Kalan Borç</div>
            <div style={{ ...styles.summaryVal, color: '#EF4444' }}>
              {remaining.toLocaleString('tr-TR')} ₺
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>İlerleme</div>
            <div style={{ ...styles.summaryVal, color: '#2E5BFF' }}>
              %{total > 0 ? Math.round((paid / total) * 100) : 0}
            </div>
            <div style={styles.progressBg}>
              <div style={{ ...styles.progressFill, width: `${total > 0 ? (paid / total) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        {/* Taksit Tablosu */}
        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1B2A4A' }}>
                  {['#', 'Tutar', 'Son Ödeme Tarihi', 'Durum', 'İşlem'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {installments.map(inst => {
                  const isOverdue = new Date(inst.dueDate) < new Date() && inst.status !== 'Odendi';
                  return (
                    <tr key={inst.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={styles.td}><strong>{inst.installmentNumber}</strong></td>
                      <td style={styles.td}>{inst.amount.toLocaleString('tr-TR')} ₺</td>
                      <td style={{ ...styles.td, color: isOverdue ? '#EF4444' : '#1B2A4A' }}>
                        {new Date(inst.dueDate).toLocaleDateString('tr-TR')}
                        {isOverdue && <span style={styles.overdueTag}>Geçti</span>}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: inst.status === 'Odendi' ? '#D1FAE5' : isOverdue ? '#FEE2E2' : '#FEF3C7',
                          color: inst.status === 'Odendi' ? '#065F46' : isOverdue ? '#991B1B' : '#92400E',
                        }}>
                          {inst.status === 'Odendi' ? 'Ödendi' : isOverdue ? 'Gecikmiş' : 'Ödenmedi'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {inst.status !== 'Odendi' ? (
                          <button
                            style={styles.payBtn}
                            onClick={() => handlePay(inst)}
                            disabled={payingId === inst.id}
                          >
                            {payingId === inst.id ? 'İşleniyor...' : '💳 Öde'}
                          </button>
                        ) : (
                          <span style={{ color: '#10B981', fontSize: 12, fontWeight: 600 }}>✓ Tamamlandı</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F4F6FB' },
  nav: { background: '#1B2A4A', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  navIcon: { width: 34, height: 34, background: '#2E5BFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navName: { color: '#FFFFFF', fontWeight: 700, fontSize: 16 },
  backBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#FFFFFF', fontSize: 13, cursor: 'pointer', padding: '8px 16px' },
  content: { padding: '40px', maxWidth: 900, margin: '0 auto' },
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 },
  pageSub: { color: '#6B7A99', fontSize: 14, marginBottom: 24 },
  success: { background: '#D1FAE5', color: '#065F46', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  error: { background: '#FEE2E2', color: '#EF4444', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 },
  summaryCard: { background: '#FFFFFF', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0', textAlign: 'center' },
  summaryLabel: { fontSize: 12, color: '#6B7A99', marginBottom: 8 },
  summaryVal: { fontSize: 24, fontWeight: 800 },
  progressBg: { height: 6, background: '#E2E8F0', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#2E5BFF', borderRadius: 3, transition: 'width 0.5s' },
  card: { background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' },
  th: { padding: '14px 18px', textAlign: 'left', color: '#FFFFFF', fontSize: 13, fontWeight: 600 },
  td: { padding: '14px 18px', fontSize: 13, color: '#1B2A4A' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  overdueTag: { marginLeft: 6, background: '#FEE2E2', color: '#EF4444', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600 },
  payBtn: { background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
};