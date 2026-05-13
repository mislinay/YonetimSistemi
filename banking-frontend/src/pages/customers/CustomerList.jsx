import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../../services/api';

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setLoading(true);
    getCustomers()
      .then((res) => setCustomers(res.data))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((c) => c.id !== id));
    } catch {
      alert('Silme işlemi başarısız.');
    }
  };

  // Arama filtresi
  const filtered = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const q = search.toLowerCase();
    return fullName.includes(q) || c.email.includes(q) || c.identityNumber.includes(q);
  });

  return (
    <div>
      {/* Başlık */}
      <div className="flex-between mb-6">
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Müşteriler</h1>
          <p style={{ color: '#6B7A99', fontSize: 13 }}>
            Toplam {customers.length} kayıtlı müşteri
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/app/customers/new')}
        >
          + Yeni Müşteri
        </button>
      </div>

      <div className="card">
        {/* Arama */}
        <div style={styles.searchBar}>
          <div style={styles.searchWrapper}>
            <svg style={styles.searchIcon} width="16" height="16" fill="none" stroke="#6B7A99" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Ad, email veya TC kimlik numarasıyla ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.center}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.center}>
            {search ? 'Arama sonucu bulunamadı.' : 'Henüz müşteri eklenmedi.'}
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad Soyad</th>
                  <th>TC Kimlik No</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: '#6B7A99', fontWeight: 600 }}>#{c.id}</td>
                    <td>
                      <div style={styles.nameCell}>
                        <div style={styles.avatar}>
                          {c.firstName[0]}{c.lastName[0]}
                        </div>
                        <span style={{ fontWeight: 600 }}>
                          {c.firstName} {c.lastName}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{c.identityNumber}</td>
                    <td>{c.email}</td>
                    <td>{c.phoneNumber}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/app/customers/${c.id}`)}
                        >
                          Detay
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(c.id)}
                        >
                          Sil
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

const styles = {
  searchBar: {
    marginBottom: '20px',
  },
  searchWrapper: {
    position: 'relative',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 38px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  center: {
    textAlign: 'center',
    padding: '48px',
    color: '#6B7A99',
    fontSize: '14px',
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    background: '#EEF2FF',
    color: '#2E5BFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0,
  },
};