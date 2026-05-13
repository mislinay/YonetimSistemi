import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// Tüm sayfalarda ortak iskelet.
// Sidebar solda sabit, sağda sayfa içeriği değişir (Outlet).
export default function Layout() {
  return (
    <div style={styles.container}>

      {/* Sol: Sabit sidebar */}
      <Sidebar />

      {/* Sağ: Sayfa içeriği */}
      <main style={styles.main}>

        {/* Üst başlık çubuğu */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerTitle}>Dijital Kredi Yönetim Sistemi</span>
          </div>
          <div style={styles.headerRight}>
            {/* Tarih */}
            <span style={styles.date}>
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Sayfa içeriği buraya gelir */}
        <div style={styles.content}>
          <Outlet />
        </div>

      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F4F6FB',
  },
  main: {
    marginLeft: '260px',    // Sidebar genişliği kadar kaydır
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    background: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1B2A4A',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  date: {
    fontSize: '12px',
    color: '#6B7A99',
  },
  content: {
    padding: '32px',
    flex: 1,
  },
};