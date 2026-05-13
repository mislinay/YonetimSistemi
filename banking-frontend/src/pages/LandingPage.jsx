import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.navLogoIcon}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <span style={styles.navBankName}>YönetimBank</span>
        </div>
        <button style={styles.navLoginBtn} onClick={() => navigate('/login')}>
          Giriş Yap
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        ...styles.hero,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s ease',
      }}>
        <div style={styles.heroBgCircle} />

        {/* Sol */}
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>Dijital Bankacılık Platformu</div>

          <div>
            <p style={styles.heroTitle}>Kredilerinizi</p>
            <p style={{ ...styles.heroTitle, color: '#2E5BFF' }}>Dijital Ortamda</p>
            <p style={styles.heroTitle}>Yönetin</p>
          </div>

          <p style={styles.heroDesc}>
            Kredi başvurusu, taksit takibi ve ödeme işlemlerinizi
            tek platformda güvenle gerçekleştirin.
          </p>

          <button style={styles.heroBtn} onClick={() => navigate('/login')}>
            Giriş Yap
          </button>

          <div style={styles.stats}>
            {[
              { value: '7/24', label: 'Kesintisiz' },
              { value: '3 Tür', label: 'Kredi' },
              { value: 'SSL', label: 'Güvenli' },
            ].map(s => (
              <div key={s.label}>
                <div style={styles.statVal}>{s.value}</div>
                <div style={styles.statLbl}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: Kart */}
        <div style={{
          ...styles.heroRight,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(40px)',
          transition: 'all 1s ease 0.3s',
        }}>
          <div style={styles.cardWrapper}>
            <div style={styles.bankCard}>
              <div style={styles.bankCardTop}>
                <span style={styles.bankCardName}>YönetimBank</span>
                <div style={{ display: 'flex' }}>
                  <div style={styles.cardCircle1} />
                  <div style={styles.cardCircle2} />
                </div>
              </div>
              <div style={styles.bankCardNumber}>•••• •••• •••• 4291</div>
              <div style={styles.bankCardBottom}>
                <div>
                  <div style={styles.cardLabel}>Kart Sahibi</div>
                  <div style={styles.cardValue}>Ahmet Yılmaz</div>
                </div>
                <div>
                  <div style={styles.cardLabel}>Son Kullanma</div>
                  <div style={styles.cardValue}>12/28</div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.notif, top: '0px', right: '-10px', transform: 'rotate(4deg)', color: '#065F46', animation: 'float1 3s ease-in-out infinite' }}>
              ✅ Taksit Ödendi
            </div>
            <div style={{ ...styles.notif, bottom: '0px', left: '-10px', transform: 'rotate(-4deg)', color: '#1E40AF', animation: 'float2 3s ease-in-out infinite 1.5s' }}>
              🎉 Kredi Onaylandı
            </div>
          </div>
        </div>
      </section>

      {/* Alt 3 Kart */}
      <section style={styles.features}>

        <div style={{ ...styles.featureCard, borderRight: '0.5px solid #E2E8F0' }}>
          <div style={{ ...styles.featureIconBox, background: '#EEF2FF' }}>
            <svg width="24" height="24" fill="none" stroke="#2E5BFF" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <p style={styles.featureTitle}>Kredi Başvurusu</p>
          <p style={styles.featureDesc}>İhtiyaç, eğitim ve taşıt kredisi seçenekleriyle hızlı başvuru yapın. Başvurunuz anında değerlendirmeye alınır.</p>
          <div style={styles.tagRow}>
            {['İhtiyaç', 'Eğitim', 'Taşıt'].map(t => (
              <span key={t} style={{ ...styles.tag, background: '#EEF2FF', color: '#2E5BFF' }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ ...styles.featureCard, borderRight: '0.5px solid #E2E8F0' }}>
          <div style={{ ...styles.featureIconBox, background: '#D1FAE5' }}>
            <svg width="24" height="24" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9,11 12,14 22,4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <p style={styles.featureTitle}>Taksit Takibi</p>
          <p style={styles.featureDesc}>Aylık taksit planınızı görüntüleyin, ödeme durumunuzu takip edin ve güvenli ödeme yapın.</p>
          <div style={styles.tagRow}>
            <span style={{ ...styles.tag, background: '#D1FAE5', color: '#065F46' }}>Ödendi</span>
            <span style={{ ...styles.tag, background: '#FEF3C7', color: '#92400E' }}>Bekliyor</span>
            <span style={{ ...styles.tag, background: '#FEE2E2', color: '#991B1B' }}>Gecikmiş</span>
          </div>
        </div>

        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIconBox, background: '#FEF3C7' }}>
            <svg width="24" height="24" fill="none" stroke="#F59E0B" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <p style={styles.featureTitle}>Borç Özeti</p>
          <p style={styles.featureDesc}>Toplam borcunuzu, kalan anaparanızı ve gecikmiş taksit sayınızı tek ekranda görüntüleyin.</p>
          <div style={styles.tagRow}>
            <span style={{ ...styles.tag, background: '#FEF3C7', color: '#92400E' }}>Toplam Borç</span>
            <span style={{ ...styles.tag, background: '#FEF3C7', color: '#92400E' }}>Kalan Anapara</span>
          </div>
        </div>

      </section>

      {/* İletişim */}
      <section style={styles.contact}>
        <h2 style={styles.contactTitle}>Bizimle İletişime Geçin</h2>
        <p style={styles.contactDesc}>
          Kredi başvurusu ve hesap işlemleri için şubemizi ziyaret edin veya bize ulaşın.
        </p>
        <div style={styles.contactInfo}>
          {[
            { icon: '📍', text: 'Merkez Şube: Atatürk Cad. No:1' },
            { icon: '📞', text: '0850 XXX XX XX' },
            { icon: '🕐', text: 'Pzt-Cum 09:00-17:00' },
          ].map(item => (
            <div key={item.text} style={styles.contactItem}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 YönetimBank · Dijital Kredi Yönetim Sistemi
      </footer>

      <style>{`
        @keyframes float1 { 0%,100%{transform:rotate(4deg) translateY(0)} 50%{transform:rotate(4deg) translateY(-6px)} }
        @keyframes float2 { 0%,100%{transform:rotate(-4deg) translateY(0)} 50%{transform:rotate(-4deg) translateY(-6px)} }
      `}</style>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#FFFFFF', fontFamily: "'Inter', 'Segoe UI', sans-serif" },

  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 60px', height: '64px',
    background: '#FFFFFF', borderBottom: '0.5px solid #E2E8F0',
    position: 'sticky', top: 0, zIndex: 100,
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  navLogoIcon: {
    width: 32, height: 32, background: '#1B2A4A',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  navBankName: { fontSize: 15, fontWeight: 600, color: '#1B2A4A' },
  navLoginBtn: {
    background: '#1B2A4A', color: 'white', border: 'none',
    borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },

  hero: {
    background: '#F0F4FF',
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    alignItems: 'center', padding: '64px 60px',
    minHeight: '85vh', position: 'relative', overflow: 'hidden',
  },
  heroBgCircle: {
    position: 'absolute', width: 400, height: 400,
    background: '#2E5BFF', borderRadius: '50%',
    opacity: 0.05, top: -100, right: 100, pointerEvents: 'none',
  },
  heroLeft: { display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 },
  heroBadge: {
    display: 'inline-block', background: '#DBEAFE', color: '#1E40AF',
    padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, width: 'fit-content',
  },
  heroTitle: { fontSize: 60, fontWeight: 700, color: '#1B2A4A', lineHeight: 1.2, margin: 0 },
  heroDesc: { fontSize: 15, color: '#6B7A99', lineHeight: 1.8, margin: 0, maxWidth: 380 },
  heroBtn: {
    background: '#1B2A4A', color: 'white', border: 'none',
    borderRadius: 10, padding: '13px 28px', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', width: 'fit-content',
  },
  stats: { display: 'flex', gap: 32, marginTop: 4 },
  statVal: { fontSize: 18, fontWeight: 700, color: '#1B2A4A' },
  statLbl: { fontSize: 12, color: '#6B7A99', marginTop: 2 },

  heroRight: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', position: 'relative', zIndex: 1,
  },
  cardWrapper: { position: 'relative', width: 400, height: 230 },
  bankCard: {
    background: 'linear-gradient(135deg, #2E5BFF, #1B2A4A)',
    borderRadius: 16, padding: 26, width: 320,
    boxShadow: '0 20px 40px rgba(46,91,255,0.3)',
    transform: 'rotate(-8deg)',
    position: 'absolute', top: 20, left: 20,
  },
  bankCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  bankCardName: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 },
  cardCircle1: { width: 26, height: 26, background: 'rgba(255,255,255,0.3)', borderRadius: '50%' },
  cardCircle2: { width: 26, height: 26, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', marginLeft: -10 },
  bankCardNumber: { color: 'white', fontSize: 15, letterSpacing: '0.12em', marginBottom: 24 },
  bankCardBottom: { display: 'flex', justifyContent: 'space-between' },
  cardLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 3 },
  cardValue: { fontSize: 12, fontWeight: 600, color: 'white' },
  notif: {
    position: 'absolute', background: 'white',
    padding: '7px 12px', borderRadius: 20,
    fontSize: 11, fontWeight: 600,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    border: '0.5px solid #E2E8F0', whiteSpace: 'nowrap',
  },

  features: {
    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
    background: '#FFFFFF', borderTop: '0.5px solid #E2E8F0',
  },
  featureCard: { padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 },
  featureIconBox: {
    width: 48, height: 48, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  featureTitle: { fontSize: 15, fontWeight: 600, color: '#1B2A4A', margin: 0 },
  featureDesc: { fontSize: 13, color: '#6B7A99', margin: 0, lineHeight: 1.7 },
  tagRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  tag: { padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },

  contact: {
    padding: '64px 60px', textAlign: 'center', background: '#1B2A4A',
  },
  contactTitle: { fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 },
  contactDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32 },
  contactInfo: { display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' },
  contactItem: { display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)', fontSize: 14 },

  footer: {
    padding: '20px 60px', textAlign: 'center',
    color: '#6B7A99', fontSize: 12,
    borderTop: '0.5px solid #E2E8F0', background: '#FFFFFF',
  },
};