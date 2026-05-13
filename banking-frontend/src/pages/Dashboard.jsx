import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, getLoansByCustomer, getInstallmentsByLoan } from '../services/api';

// (Admin Ana Sayfa)
function StatCard({ title, value, sub, color, icon }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
      <div style={styles.statTop}>
        <span style={styles.statTitle}>{title}</span>
        <div style={{ ...styles.statIcon, background: color + '18', color }}>
          {icon}
        </div>
      </div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
  activeLoanCount: 0,
  overdueCount: 0,
  todayPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([getCustomers()])
    .then(async ([cRes]) => {
      const customerList = cRes.data;
      setCustomers(customerList);

      let activeLoanCount = 0;
      let overdueCount = 0;
      let todayPayments = 0;

      await Promise.all(
        customerList.map(async (c) => {
          const lRes = await getLoansByCustomer(c.id);
          const loans = lRes.data;
          activeLoanCount += loans.filter(l => l.status === 'Aktif').length;

          await Promise.all(
            loans.filter(l => l.status === 'Aktif').map(async (loan) => {
              const iRes = await getInstallmentsByLoan(loan.id);
              const insts = iRes.data;
              overdueCount += insts.filter(i => i.status === 'Gecikmis').length;
              todayPayments += insts.filter(i =>
                i.payment &&
                new Date(i.payment.paymentDate).toDateString() === new Date().toDateString()
              ).length;
            })
          );
        })
      );

      setStats({ activeLoanCount, overdueCount, todayPayments });
    })
    .finally(() => setLoading(false));
}, []);

  return (
    <div>
      <div style={styles.welcomeBar}>
        <div>
          <h1 style={styles.welcomeTitle}>Merhaba, Yönetici 👋</h1>
          <p style={styles.welcomeSub}>İşte bugünkü sisteme genel bakış.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/app/customers/new')}
        >
          + Yeni Müşteri
        </button>
      </div>

      {/* Özet Kartlar */}
      <div style={styles.statsGrid}>
        <StatCard
          title="Toplam Müşteri"
          value={loading ? '...' : customers.length}
          sub="Kayıtlı bireysel müşteri"
          color="#2E5BFF"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          }
        />
        <StatCard
          title="Aktif Krediler"
          value={loading ? '...' : stats.activeLoanCount} 
          sub="Devam eden kredi sözleşmeleri"
          color="#10B981"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          }
        />
        <StatCard
          title="Gecikmiş Taksit"
          value={loading ? '...' : stats.overdueCount} 
          sub="Ödeme tarihi geçmiş taksitler"
          color="#EF4444"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          }
        />
        <StatCard
          title="Bugünkü Ödemeler"
          value={loading ? '...' : stats.todayPayments}
          sub="Bugün yapılan ödeme işlemleri"
          color="#F59E0B"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />
      </div>

      {/* Son Müşteriler Tablosu */}
      <div className="card">
        <div className="flex-between mb-4">
          <h2 style={styles.tableTitle}>Son Eklenen Müşteriler</h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/app/customers')}
          >
            Tümünü Gör →
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingText}>Yükleniyor...</div>
        ) : customers.length === 0 ? (
          <div style={styles.emptyText}>Henüz müşteri eklenmedi.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ad Soyad</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: '#6B7A99' }}>{c.id}</td>
                    <td style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</td>
                    <td>{c.email}</td>
                    <td>{c.phoneNumber}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/app/customers/${c.id}`)}
                      >
                        Detay
                      </button>
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
  welcomeBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  welcomeTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1B2A4A',
    marginBottom: '4px',
  },
  welcomeSub: {
    color: '#6B7A99',
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '28px',
  },
  statCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  statTitle: {
    fontSize: '13px',
    color: '#6B7A99',
    fontWeight: '500',
  },
  statIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '4px',
  },
  statSub: {
    fontSize: '12px',
    color: '#6B7A99',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1B2A4A',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px',
    color: '#6B7A99',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px',
    color: '#6B7A99',
    fontSize: '14px',
  },
};