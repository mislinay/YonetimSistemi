import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInstallmentsByLoan, getLoanById, createPayment } from '../../services/api';

export default function InstallmentList() {
  const { id: loanId } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [loanId]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getLoanById(loanId), getInstallmentsByLoan(loanId)])
      .then(([lRes, iRes]) => {
        setLoan(lRes.data);
        setInstallments(iRes.data);
      })
      .catch(() => setErrorMsg('Veriler yüklenemedi.'))
      .finally(() => setLoading(false));
  };

  const handlePay = async (installment) => {
    if (installment.status === 'Odendi') return;
    setPayingId(installment.id);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await createPayment({
        installmentId: installment.id,
        amountPaid: installment.amount,
      });
      setSuccessMsg(`${installment.installmentNumber}. taksit başarıyla ödendi!`);
      // Listeyi yenile
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Ödeme işlemi başarısız.');
    } finally {
      setPayingId(null);
    }
  };

  // Durum badge'i
  const statusBadge = (status) => {
    if (status === 'Odendi')   return { cls: 'badge badge-success', label: 'Ödendi' };
    if (status === 'Gecikmis') return { cls: 'badge badge-danger',  label: 'Gecikmiş' };
    return                            { cls: 'badge badge-warning', label: 'Ödenmedi' };
  };

  // Özet hesaplama
  const paid   = installments.filter(i => i.status === 'Odendi').length;
  const unpaid = installments.filter(i => i.status !== 'Odendi').length;
  const overdue = installments.filter(i => i.status === 'Gecikmis').length;
  const totalPaid = installments
    .filter(i => i.status === 'Odendi')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalRemaining = installments
    .filter(i => i.status !== 'Odendi')
    .reduce((sum, i) => sum + i.amount, 0);

  if (loading) return <div style={styles.center}>Yükleniyor...</div>;

  return (
    <div>
      {/* Başlık */}
      <div className="flex-between mb-6">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Taksit Planı</h1>
          <p style={{ color: '#6B7A99', fontSize: 13 }}>
            {loan?.loanType} Kredisi #{loanId} · {installments.length} taksit
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(`/loans/${loanId}`)}>
          ← Geri
        </button>
      </div>

      {/* Bildirimler */}
      {successMsg && (
        <div style={styles.success}>{successMsg}</div>
      )}
      {errorMsg && (
        <div style={styles.error}>{errorMsg}</div>
      )}

      {/* Özet Kartlar */}
      <div style={styles.summaryGrid}>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Ödenen</div>
          <div style={{ ...styles.summaryValue, color: '#10B981' }}>{paid}</div>
          <div style={styles.summaryMoney}>{totalPaid.toLocaleString('tr-TR')} ₺</div>
        </div>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Kalan</div>
          <div style={{ ...styles.summaryValue, color: '#F59E0B' }}>{unpaid}</div>
          <div style={styles.summaryMoney}>{totalRemaining.toLocaleString('tr-TR')} ₺</div>
        </div>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Gecikmiş</div>
          <div style={{ ...styles.summaryValue, color: '#EF4444' }}>{overdue}</div>
          <div style={styles.summaryMoney}>Ödeme gerekiyor</div>
        </div>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.summaryLabel}>İlerleme</div>
          <div style={{ ...styles.summaryValue, color: '#2E5BFF' }}>
            %{installments.length > 0 ? Math.round((paid / installments.length) * 100) : 0}
          </div>
          {/* İlerleme çubuğu */}
          <div style={styles.progressBg}>
            <div style={{
              ...styles.progressFill,
              width: `${installments.length > 0 ? (paid / installments.length) * 100 : 0}%`
            }} />
          </div>
        </div>
      </div>

      {/* Taksit Tablosu */}
      <div className="card">
        <h2 style={styles.cardTitle}>Taksit Listesi</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Taksit Tutarı</th>
                <th>Son Ödeme Tarihi</th>
                <th>Durum</th>
                <th>Ödeme Tarihi</th>
                <th>İşlem Referansı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {installments.map((inst) => {
                const badge = statusBadge(inst.status);
                const isOverdue = new Date(inst.dueDate) < new Date() && inst.status !== 'Odendi';
                return (
                  <tr key={inst.id}>
                    <td style={{ fontWeight: 700, color: '#1B2A4A' }}>
                      {inst.installmentNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {inst.amount.toLocaleString('tr-TR')} ₺
                    </td>
                    <td style={{ color: isOverdue ? '#EF4444' : '#1B2A4A', fontWeight: isOverdue ? 600 : 400 }}>
                      {new Date(inst.dueDate).toLocaleDateString('tr-TR')}
                      {isOverdue && <span style={styles.overdueTag}>Geçti</span>}
                    </td>
                    <td>
                      <span className={badge.cls}>{badge.label}</span>
                    </td>
                    <td style={{ color: '#6B7A99' }}>
                      {inst.payment
                        ? new Date(inst.payment.paymentDate).toLocaleDateString('tr-TR')
                        : '—'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#6B7A99' }}>
                      {inst.payment?.transactionReference ?? '—'}
                    </td>
                    <td>
                      {inst.status !== 'Odendi' ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handlePay(inst)}
                          disabled={payingId === inst.id}
                        >
                          {payingId === inst.id ? 'İşleniyor...' : '💳 Öde'}
                        </button>
                      ) : (
                        <span style={styles.paidLabel}>✓ Tamamlandı</span>
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
  );
}

const styles = {
  center: { textAlign: 'center', padding: 48, color: '#6B7A99' },
  success: {
    background: '#D1FAE5', color: '#065F46',
    padding: '12px 16px', borderRadius: 8,
    fontSize: 13, marginBottom: 20,
  },
  error: {
    background: '#FEE2E2', color: '#EF4444',
    padding: '12px 16px', borderRadius: 8,
    fontSize: 13, marginBottom: 20,
  },
  summaryGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
    gap: 20, marginBottom: 24,
  },
  summaryCard: { textAlign: 'center', padding: '20px 16px' },
  summaryLabel: { fontSize: 12, color: '#6B7A99', marginBottom: 8 },
  summaryValue: { fontSize: 28, fontWeight: 800, marginBottom: 4 },
  summaryMoney: { fontSize: 12, color: '#6B7A99' },
  progressBg: {
    height: 6, background: '#E2E8F0',
    borderRadius: 3, marginTop: 8, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: '#2E5BFF',
    borderRadius: 3, transition: 'width 0.5s',
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#1B2A4A', marginBottom: 20 },
  overdueTag: {
    display: 'inline-block', marginLeft: 6,
    background: '#FEE2E2', color: '#EF4444',
    fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600,
  },
  paidLabel: { fontSize: 12, color: '#10B981', fontWeight: 600 },
};