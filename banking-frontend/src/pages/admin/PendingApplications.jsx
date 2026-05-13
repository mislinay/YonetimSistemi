import { useState, useEffect } from 'react';
import { getPendingLoans, approveLoan, rejectLoan } from '../../services/api';

export default function PendingApplications() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = () => {
    setLoading(true);
    getPendingLoans()
      .then(res => setLoans(res.data))
      .catch(() => setLoans([]))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await approveLoan(id);
      setMessage('✅ Kredi başvurusu onaylandı, taksit planı oluşturuldu.');
      fetchPending();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Hata oluştu.'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bu başvuruyu reddetmek istediğinizden emin misiniz?')) return;
    setProcessingId(id);
    try {
      await rejectLoan(id);
      setMessage('🚫 Kredi başvurusu reddedildi.');
      fetchPending();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Hata oluştu.'));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Bekleyen Başvurular</h1>
        <p style={{ color: '#6B7A99', fontSize: 13 }}>
          Müşterilerden gelen kredi başvurularını onaylayın veya reddedin.
        </p>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, fontSize: 13,
          marginBottom: 20,
          background: message.startsWith('✅') ? '#D1FAE5' : message.startsWith('🚫') ? '#FEE2E2' : '#FEE2E2',
          color: message.startsWith('✅') ? '#065F46' : '#991B1B',
        }}>
          {message}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#6B7A99' }}>Yükleniyor...</div>
        ) : loans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <p style={{ color: '#6B7A99', fontSize: 14 }}>Bekleyen başvuru bulunmuyor.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Müşteri</th>
                  <th>Kredi Türü</th>
                  <th>Ana Para</th>
                  <th>Kar Payı Oranı</th>
                  <th>Vade</th>
                  <th>Kredi Skoru</th>
                  <th>Başvuru Tarihi</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td style={{ color: '#6B7A99', fontWeight: 600 }}>#{loan.id}</td>
                    <td style={{ fontWeight: 600 }}>{loan.customerFullName}</td>
                    <td>
                      <span className="badge badge-info">{loan.loanType}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {loan.principalAmount.toLocaleString('tr-TR')} ₺
                    </td>
                    <td>%{loan.profitRate}</td>
                    <td>{loan.termInMonths} Ay</td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: loan.creditScore >= 1500 ? '#10B981'
                          : loan.creditScore >= 1000 ? '#F59E0B'
                            : '#EF4444'
                      }}>
                        {loan.creditScore}
                      </span>
                    </td>
                    <td>{new Date(loan.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(loan.id)}
                          disabled={processingId === loan.id}
                        >
                          {processingId === loan.id ? '...' : '✅ Onayla'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(loan.id)}
                          disabled={processingId === loan.id}
                        >
                          {processingId === loan.id ? '...' : '❌ Reddet'}
                        </button>
                      </div>
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