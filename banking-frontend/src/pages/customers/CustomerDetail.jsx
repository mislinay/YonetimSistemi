import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomer, getLoansByCustomer } from '../../services/api';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loans, setLoans] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCustomerById(id), getLoansByCustomer(id)])
      .then(([cRes, lRes]) => {
        setCustomer(cRes.data);
        setForm({
          firstName: cRes.data.firstName,
          lastName: cRes.data.lastName,
          email: cRes.data.email,
          phoneNumber: cRes.data.phoneNumber,
        });
        setLoans(lRes.data);
      })
      .catch(() => setError('Müşteri bilgileri yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateCustomer(id, form);
      setCustomer(res.data);
      setEditing(false);
    } catch {
      setError('Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  // Kredi durumuna göre badge rengi
  const loanBadge = (status) => {
    if (status === 'Aktif') return 'badge badge-success';
    if (status === 'Kapatildi') return 'badge badge-info';
    return 'badge badge-warning';
  };

  if (loading) return <div style={styles.center}>Yükleniyor...</div>;
  if (error && !customer) return <div style={styles.center}>{error}</div>;

  return (
    <div>
      {/* Başlık */}
      <div className="flex-between mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={styles.bigAvatar}>
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <h1 style={styles.name}>{customer.firstName} {customer.lastName}</h1>
            <p style={{ color: '#6B7A99', fontSize: 13 }}>
              Müşteri #{customer.id} · {new Date(customer.createdAt).toLocaleDateString('tr-TR')} tarihinden beri
            </p>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/app/customers')}>
          ← Geri
        </button>
      </div>

      <div style={styles.grid}>

        {/* Sol: Müşteri Bilgileri */}
        <div>
          <div className="card mb-4">
            <div className="flex-between mb-4">
              <h2 style={styles.cardTitle}>Kişisel Bilgiler</h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'İptal' : '✏️ Düzenle'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Ad</label>
                  <input value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Soyad</label>
                  <input value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </form>
            ) : (
              <div style={styles.infoList}>
                {[
                  { label: 'TC Kimlik No', value: customer.identityNumber },
                  { label: 'Email',        value: customer.email },
                  { label: 'Telefon',      value: customer.phoneNumber },
                  { label: 'Kayıt Tarihi', value: new Date(customer.createdAt).toLocaleDateString('tr-TR') },
                ].map((row) => (
                  <div key={row.label} style={styles.infoRow}>
                    <span style={styles.infoLabel}>{row.label}</span>
                    <span style={styles.infoValue}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hızlı Erişim Butonları */}
          <div className="card">
            <h2 style={{ ...styles.cardTitle, marginBottom: 16 }}>Hızlı İşlemler</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/app/customers/${id}/debt`)}
              >
                📊 Borç Özeti
              </button>
            </div>
          </div>
        </div>

        {/* Sağ: Krediler */}
        <div className="card">
          <div className="flex-between mb-4">
            <h2 style={styles.cardTitle}>Krediler ({loans.length})</h2>
          </div>

          {loans.length === 0 ? (
            <div style={styles.empty}>Bu müşteriye ait kredi bulunmuyor.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  style={styles.loanCard}
                  onClick={() => navigate(`/app/loans/${loan.id}`)}
                >
                  <div className="flex-between">
                    <div>
                      <div style={styles.loanType}>{loan.loanType} Kredisi</div>
                      <div style={styles.loanAmount}>
                        {loan.principalAmount.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={loanBadge(loan.status)}>{loan.status}</span>
                      <div style={styles.loanTerm}>{loan.termInMonths} ay</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  center: { textAlign: 'center', padding: 48, color: '#6B7A99' },
  grid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 },
  bigAvatar: {
    width: 52, height: 52,
    background: '#1B2A4A', color: 'white',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, fontWeight: 700,
  },
  name: { fontSize: 20, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#1B2A4A' },
  infoList: { display: 'flex', flexDirection: 'column', gap: 0 },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid #F1F5F9',
  },
  infoLabel: { fontSize: 13, color: '#6B7A99' },
  infoValue: { fontSize: 13, fontWeight: 600, color: '#1B2A4A' },
  loanCard: {
    padding: 16, border: '1px solid #E2E8F0',
    borderRadius: 10, cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#FAFBFF',
  },
  loanType: { fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 },
  loanAmount: { fontSize: 18, fontWeight: 800, color: '#2E5BFF' },
  loanTerm: { fontSize: 12, color: '#6B7A99', marginTop: 4 },
  empty: { textAlign: 'center', padding: 32, color: '#6B7A99', fontSize: 14 },
};