import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLoansByCustomer, getDebtSummary, getInstallmentsByLoan, createPayment } from '../../services/api';

export default function CustomerPortal() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('home');
  const [loans, setLoans] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [payMsg, setPayMsg] = useState('');

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getLoansByCustomer(customerId),
      getDebtSummary(customerId),
    ])
      .then(([lRes, sRes]) => {
        setLoans(lRes.data);
        setSummary(sRes.data);
      })
      .finally(() => setLoading(false));
  };

  const handleSelectLoan = async (loan) => {
    if (loan.status !== 'Aktif') return;
    setSelectedLoan(loan);
    const res = await getInstallmentsByLoan(loan.id);
    setInstallments(res.data);
    setActiveTab('installments');
  };

  const handlePay = async (inst) => {
    setPayingId(inst.id);
    setPayMsg('');
    try {
      await createPayment({ installmentId: inst.id, amountPaid: inst.amount });
      setPayMsg('✅ Ödeme başarılı!');
      const res = await getInstallmentsByLoan(selectedLoan.id);
      setInstallments(res.data);
      fetchData();
    } catch (err) {
      setPayMsg('❌ ' + (err.response?.data?.message || 'Ödeme başarısız.'));
    } finally {
      setPayingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const statusBadge = (status) => ({
    'Aktif':      { bg: '#D1FAE5', color: '#065F46', label: 'Aktif' },
    'Beklemede':  { bg: '#FEF3C7', color: '#92400E', label: 'Beklemede' },
    'Reddedildi': { bg: '#FEE2E2', color: '#991B1B', label: 'Reddedildi' },
    'Kapatildi':  { bg: '#DBEAFE', color: '#1E40AF', label: 'Kapatıldı' },
  }[status] || { bg: '#F3F4F6', color: '#6B7280', label: status });

  const tabs = [
    { key: 'home',         label: '🏠 Ana Sayfa' },
    { key: 'loans',        label: '💳 Kredilerim' },
    { key: 'debt',         label: '📊 Borç Özeti' },
  ];

  if (loading) return <div style={styles.center}>Yükleniyor...</div>;

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
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {user?.fullName}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Çıkış Yap</button>
        </div>
      </nav>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>

        {/* ── ANA SAYFA ── */}
        {activeTab === 'home' && (
          <div>
            <div style={styles.welcome}>
              <h1 style={styles.welcomeTitle}>Merhaba, {user?.fullName?.split(' ')[0]} 👋</h1>
              <p style={styles.welcomeSub}>Hesabınıza genel bakış</p>
            </div>

            {summary && (
              <div style={styles.summaryGrid}>
                {[
                  { label: 'Toplam Borç',    value: summary.totalDebt.toLocaleString('tr-TR') + ' ₺',           color: '#EF4444' },
                  { label: 'Kalan Anapara',  value: summary.remainingPrincipal.toLocaleString('tr-TR') + ' ₺',  color: '#2E5BFF' },
                  { label: 'Gecikmiş Taksit',value: summary.overdueInstallmentCount + ' Adet',                   color: '#F59E0B' },
                  { label: 'Ödenen Taksit',  value: summary.paidInstallments.length + ' Adet',                   color: '#10B981' },
                ].map(item => (
                  <div key={item.label} style={{ ...styles.summaryCard, borderTop: `4px solid ${item.color}` }}>
                    <div style={styles.summaryLabel}>{item.label}</div>
                    <div style={{ ...styles.summaryValue, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.quickActions}>
              <button className="btn btn-primary" onClick={() => navigate(`/portal/${customerId}/apply`)}>
                + Kredi Başvurusu Yap
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('loans')}>
                Kredilerimi Gör
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('debt')}>
                Borç Özetim
              </button>
            </div>
          </div>
        )}

        {/* ── KREDİLERİM ── */}
        {activeTab === 'loans' && (
          <div>
            <div style={styles.tabHeader}>
              <h2 style={styles.tabTitle}>Kredilerim</h2>
              <button className="btn btn-primary" onClick={() => navigate(`/portal/${customerId}/apply`)}>
                + Yeni Başvuru
              </button>
            </div>

            {loans.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💳</div>
                <p style={{ color: '#6B7A99' }}>Henüz kredi başvurunuz yok.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }}
                  onClick={() => navigate(`/portal/${customerId}/apply`)}>
                  İlk Başvuruyu Yap
                </button>
              </div>
            ) : (
              <div style={styles.loanGrid}>
                {loans.map(loan => {
                  const badge = statusBadge(loan.status);
                  return (
                    <div key={loan.id} style={styles.loanCard}>
                      <div style={styles.loanTop}>
                        <div>
                          <div style={styles.loanType}>{loan.loanType} Kredisi</div>
                          <div style={styles.loanAmount}>{loan.principalAmount.toLocaleString('tr-TR')} ₺</div>
                        </div>
                        <span style={{ ...styles.badge, background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </div>
                      <div style={styles.loanMeta}>
                        <div style={styles.metaItem}>
                          <span style={styles.metaLabel}>Vade</span>
                          <span style={styles.metaValue}>{loan.termInMonths} Ay</span>
                        </div>
                        <div style={styles.metaItem}>
                          <span style={styles.metaLabel}>Kar Payı</span>
                          <span style={styles.metaValue}>%{loan.profitRate}</span>
                        </div>
                        <div style={styles.metaItem}>
                          <span style={styles.metaLabel}>Tarih</span>
                          <span style={styles.metaValue}>{new Date(loan.startDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      {loan.status === 'Aktif' && (
                        <button style={styles.detailBtn} onClick={() => handleSelectLoan(loan)}>
                          📋 Taksit Planı & Ödeme →
                        </button>
                      )}
                      {loan.status === 'Beklemede' && (
                        <div style={styles.pendingNote}>⏳ Admin onayı bekleniyor</div>
                      )}
                      {loan.status === 'Reddedildi' && (
                        <div style={styles.rejectedNote}>❌ Başvuru reddedildi</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAKSİTLER ── */}
        {activeTab === 'installments' && selectedLoan && (
          <div>
            <div style={styles.tabHeader}>
              <div>
                <h2 style={styles.tabTitle}>{selectedLoan.loanType} Kredisi - Taksit Planı</h2>
                <p style={{ color: '#6B7A99', fontSize: 13 }}>{installments.length} taksit</p>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveTab('loans')}>← Geri</button>
            </div>

            {payMsg && (
              <div style={{
                padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 16,
                background: payMsg.startsWith('✅') ? '#D1FAE5' : '#FEE2E2',
                color: payMsg.startsWith('✅') ? '#065F46' : '#991B1B',
              }}>{payMsg}</div>
            )}

            {/* İlerleme */}
            <div style={styles.progressCard}>
              <div style={styles.progressInfo}>
                <span style={{ fontSize: 13, color: '#6B7A99' }}>
                  {installments.filter(i => i.status === 'Odendi').length} / {installments.length} taksit ödendi
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2E5BFF' }}>
                  %{Math.round((installments.filter(i => i.status === 'Odendi').length / installments.length) * 100)}
                </span>
              </div>
              <div style={styles.progressBg}>
                <div style={{
                  ...styles.progressFill,
                  width: `${(installments.filter(i => i.status === 'Odendi').length / installments.length) * 100}%`
                }} />
              </div>
            </div>

            <div style={styles.card}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1B2A4A' }}>
                    {['#', 'Tutar', 'Son Ödeme', 'Durum', 'İşlem'].map(h => (
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
                            <button style={styles.payBtn} onClick={() => handlePay(inst)} disabled={payingId === inst.id}>
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
        )}

        {/* ── BORÇ ÖZETİ ── */}
        {activeTab === 'debt' && summary && (
          <div>
            <h2 style={styles.tabTitle}>Borç Özeti</h2>

            <div style={styles.debtTop}>
              <div style={styles.debtBigCard}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>Toplam Borç</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: '#FFFFFF' }}>
                  {summary.totalDebt.toLocaleString('tr-TR')} ₺
                </div>
              </div>
              <div style={styles.debtMiniGrid}>
                {[
                  { label: 'Kalan Anapara',   value: summary.remainingPrincipal.toLocaleString('tr-TR') + ' ₺', color: '#2E5BFF' },
                  { label: 'Gecikmiş Taksit', value: summary.overdueInstallmentCount + ' Adet',                  color: '#EF4444' },
                  { label: 'Ödenen Taksit',   value: summary.paidInstallments.length + ' Adet',                  color: '#10B981' },
                  { label: 'Ödenmeyen',       value: summary.unpaidInstallments.length + ' Adet',                color: '#F59E0B' },
                ].map(item => (
                  <div key={item.label} style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>{item.label}</div>
                    <div style={{ ...styles.summaryValue, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {summary.unpaidInstallments.length > 0 && (
              <div style={{ ...styles.card, marginTop: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1B2A4A', marginBottom: 16 }}>
                  Ödenmeyen Taksitler
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#1B2A4A' }}>
                      {['Taksit No', 'Tutar', 'Son Ödeme', 'Durum'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.unpaidInstallments.map(inst => (
                      <tr key={inst.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={styles.td}>#{inst.installmentNumber}</td>
                        <td style={{ ...styles.td, color: '#EF4444', fontWeight: 600 }}>{inst.amount.toLocaleString('tr-TR')} ₺</td>
                        <td style={styles.td}>{new Date(inst.dueDate).toLocaleDateString('tr-TR')}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: '#FEF3C7', color: '#92400E' }}>{inst.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F4F6FB' },
  center: { textAlign: 'center', padding: 80, color: '#6B7A99' },
  nav: {
    background: '#1B2A4A', height: 64,
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 40px',
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  navIcon: { width: 34, height: 34, background: '#2E5BFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navName: { color: '#FFFFFF', fontWeight: 700, fontSize: 16 },
  navRight: { display: 'flex', alignItems: 'center', gap: 16 },
  navUser: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  logoutBtn: { padding: '7px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#FFFFFF', fontSize: 13, cursor: 'pointer' },
  tabBar: {
    background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
    display: 'flex', padding: '0 40px', gap: 4,
  },
  tab: {
    padding: '16px 20px', background: 'transparent', border: 'none',
    fontSize: 14, fontWeight: 500, color: '#6B7A99', cursor: 'pointer',
    borderBottom: '2px solid transparent', transition: 'all 0.2s',
  },
  tabActive: { color: '#2E5BFF', borderBottom: '2px solid #2E5BFF', fontWeight: 700 },
  content: { padding: '40px', maxWidth: 1100, margin: '0 auto' },
  welcome: { marginBottom: 24 },
  welcomeTitle: { fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 },
  welcomeSub: { color: '#6B7A99', fontSize: 14 },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 24 },
  summaryCard: { background: '#FFFFFF', borderRadius: 12, padding: '20px 24px', border: '1px solid #E2E8F0' },
  summaryLabel: { fontSize: 12, color: '#6B7A99', marginBottom: 8 },
  summaryValue: { fontSize: 24, fontWeight: 800 },
  quickActions: { display: 'flex', gap: 12 },
  tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  tabTitle: { fontSize: 20, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 },
  empty: { textAlign: 'center', padding: '60px 0' },
  loanGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 },
  loanCard: { border: '1px solid #E2E8F0', borderRadius: 12, padding: 20, background: '#FFFFFF' },
  loanTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  loanType: { fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 },
  loanAmount: { fontSize: 22, fontWeight: 800, color: '#2E5BFF' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  loanMeta: { display: 'flex', gap: 16, marginBottom: 16 },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaLabel: { fontSize: 11, color: '#6B7A99' },
  metaValue: { fontSize: 13, fontWeight: 600, color: '#1B2A4A' },
  detailBtn: { width: '100%', padding: 10, background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 8, color: '#2E5BFF', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  pendingNote: { padding: 10, background: '#FEF3C7', borderRadius: 8, fontSize: 12, color: '#92400E', textAlign: 'center' },
  rejectedNote: { padding: 10, background: '#FEE2E2', borderRadius: 8, fontSize: 12, color: '#991B1B', textAlign: 'center' },
  progressCard: { background: '#FFFFFF', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0', marginBottom: 20 },
  progressInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  progressBg: { height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#2E5BFF', borderRadius: 4, transition: 'width 0.5s' },
  card: { background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' },
  th: { padding: '14px 18px', textAlign: 'left', color: '#FFFFFF', fontSize: 13, fontWeight: 600 },
  td: { padding: '14px 18px', fontSize: 13, color: '#1B2A4A' },
  payBtn: { background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  debtTop: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 8 },
  debtBigCard: { background: 'linear-gradient(135deg, #1B2A4A, #2A3F6F)', borderRadius: 12, padding: 32 },
  debtMiniGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
};