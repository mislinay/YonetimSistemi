import { NavLink, useNavigate } from 'react-router-dom';

// Sidebar'da gösterilecek menü öğeleri
const menuItems = [
  {
    label: 'Dashboard',
    path: '/app/dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Müşteriler',
    path: '/app/customers',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Başvurular',
    path: '/app/pending-applications',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside style={styles.sidebar}>
      {/* Logo & Banka Adı */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        </div>

        <div>
          <div style={styles.bankName}>YönetimBank</div>
          <div style={styles.bankSub}>Dijital Bankacılık</div>
        </div>
      </div>

      {/* Menü */}
      <nav style={styles.nav}>
        <div style={styles.menuLabel}>ANA MENÜ</div>

        {menuItems.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.menuItem,
              ...(isActive ? styles.menuItemActive : {}),
            })}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Alt bilgi */}
      <div style={styles.footer}>
        <div style={styles.footerUser}>
          <div style={styles.avatar}>YB</div>
          <div>
            <div style={styles.userName}>Yönetici</div>
            <div style={styles.userRole}>Admin</div>
          </div>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={() => navigate('/')}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0F1E36 0%, #1B2A4A 100%)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '8px',
  },

  logoIcon: {
    width: '42px',
    height: '42px',
    background: '#2E5BFF',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  bankName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '16px',
    letterSpacing: '0.02em',
  },

  bankSub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '11px',
    marginTop: '1px',
  },

  nav: {
    flex: 1,
    padding: '8px 12px',
    overflowY: 'auto',
  },

  menuLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    padding: '8px 8px 12px',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 14px',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '2px',
    transition: 'all 0.2s',
  },

  menuItemActive: {
    background: '#2E5BFF',
    color: '#FFFFFF',
  },

  menuIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },

  footer: {
    padding: '16px 20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  footerUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  avatar: {
    width: '36px',
    height: '36px',
    background: '#2E5BFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
  },

  userName: {
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '600',
  },

  userRole: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '11px',
  },

  logoutBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
};