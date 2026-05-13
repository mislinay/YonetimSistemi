import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLoanById } from '../../services/api';

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoanById(id)
      .then((res) => setLoan(res.data))
      .catch(() => setLoan(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.center}>Yükleniyor...</div>;
  if (!loan) return <div style={styles.center}>Kredi bulunamadı.</div>;

  const statusBadge = loan.status === 'Aktif' ? 'badge badge-success' : 'badge badge-info';

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>
            {loan.loanType} Kredisi
          </h1>
          <p style={{ color: '#6B7A99', fontSize: 13 }}>Kredi #{loan.id}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/loans/${id}/installments`)}
          >
            Taksit Planı →
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/customers/${loan.customerId}`)}
          >
            ← Müşteriye Dön
          </button>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div style={styles.topCards}>
        {[
          { label: 'Ana Para',    value: loan.principalAmount.toLocaleString('tr-TR') + ' ₺', color: '#2E5BFF' },
          { label: 'Kar Payı Oranı', value: `%${loan.profitRate}`,                              color: '#F59E0B' },
          { label: 'Vade',       value: `${loan.termInMonths} Ay`,                            color: '#10B981' },
          { label: 'Durum',      value: loan.status,                                          color: loan.status === 'Aktif' ? '#10B981' : '#6B7A99' },
        ].map((item) => (
          <div key={item.label} className="card" style={styles.topCard}>
            <div style={{ fontSize: 12, color: '#6B7A99', marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Detay */}
      <div className="card">
        <h2 style={styles.cardTitle}>Kredi Detayları</h2>
        <div style={styles.infoGrid}>
          {[
            { label: 'Kredi ID',         value: `#${loan.id}` },
            { label: 'Müşteri ID',       value: `#${loan.customerId}` },
            { label: 'Kredi Türü',       value: loan.loanType },
            { label: 'Durum',            value: loan.status },
            { label: 'Başlangıç Tarihi', value: new Date(loan.startDate).toLocaleDateString('tr-TR') },
            { label: 'Oluşturma Tarihi', value: new Date(loan.createdAt).toLocaleDateString('tr-TR') },
          ].map((row) => (
            <div key={row.label} style={styles.infoRow}>
              <span style={styles.infoLabel}>{row.label}</span>
              <span style={styles.infoValue}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/loans/${id}/installments`)}
          >
            📋 Taksit Planını Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  center: { textAlign: 'center', padding: 48, color: '#6B7A99' },
  topCards: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 24 },
  topCard: { padding: 20 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#1B2A4A', marginBottom: 20 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid #F1F5F9',
  },
  infoLabel: { fontSize: 13, color: '#6B7A99' },
  infoValue: { fontSize: 13, fontWeight: 600, color: '#1B2A4A' },
};