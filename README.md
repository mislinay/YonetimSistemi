# Dijital Kredi ve Geri Ödeme Yönetim Sistemi

Architecht TechTalent teknik mülakat kapsamında geliştirilmiş full stack bankacılık uygulaması.

---

## 🚀 Teknoloji Stack

| Katman      | Teknoloji                        |
|-------------|----------------------------------|
| Backend     | C#, .NET Core 8                  |
| Frontend    | React (Vite)                     |
| Veritabanı  | Microsoft SQL Server             |
| ORM         | Entity Framework Core            |
| Şifreleme   | BCrypt.Net                       |

---

## 🏗️ Mimari

Katmanlı mimari (Layered Architecture) kullanılmıştır:

### Katmanlar

- **YonetimSistemi.Domain** → Entity'ler ve Enum'lar
- **YonetimSistemi.Application** → UseCase'ler, DTO'lar, Interface'ler
- **YonetimSistemi.Infrastructure** → Repository implementasyonları, DbContext, Mock Servisler
- **YonetimSistemi.API** → Controller'lar, Program.cs

---

## 📦 Kurulum

### Gereksinimler
- .NET 8 SDK
- Node.js 18+
- SQL Server (LocalDB veya Express)

### Backend Kurulum

```bash
# Repoyu klonla
git clone <repo-url>
cd YonetimSistemi

# API klasörüne gir
cd YonetimSistemi.API

# Migration oluştur ve veritabanını hazırla
dotnet ef migrations add InitialCreate --project ../YonetimSistemi.Infrastructure --startup-project .
dotnet ef database update --project ../YonetimSistemi.Infrastructure --startup-project .

# Backend'i başlat
dotnet run
```

Backend `http://localhost:5039` adresinde çalışır.
Swagger UI: `http://localhost:5039/swagger`

### Frontend Kurulum

```bash
cd banking-frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.

---

## 👤 Varsayılan Admin Hesabı

Uygulama ilk çalıştığında seed data ile admin hesabı otomatik oluşturulur:

---

## 🔐 Roller ve Yetkiler

### Admin (Banka Çalışanı)
- Müşteri oluşturma, güncelleme, silme
- Kredi başvurularını görüntüleme, onaylama veya reddetme
- Tüm kredileri ve taksitleri görüntüleme
- Tüm müşterilerin borç özetini görüntüleme

### Müşteri (Bireysel)
- Kendi hesabına giriş yapma
- Kredi başvurusu yapma (İhtiyaç / Eğitim / Taşıt)
- Kendi kredilerini listeleme ve detay görüntüleme
- Aktif kredilerinin taksit planını görüntüleme
- Taksit ödemesi yapma
- Kendi borç özetini görüntüleme

---

## 📡 API Endpoint Listesi

### Auth
| Method | Endpoint         | Açıklama       |
|--------|-----------------|----------------|
| POST   | /api/auth/login | Giriş yap      |

### Customers
| Method | Endpoint              | Açıklama              |
|--------|-----------------------|-----------------------|
| GET    | /api/customers        | Tüm müşterileri listele |
| GET    | /api/customers/{id}   | Müşteri detayı        |
| POST   | /api/customers        | Yeni müşteri oluştur  |
| PUT    | /api/customers/{id}   | Müşteri güncelle      |
| DELETE | /api/customers/{id}   | Müşteri sil           |
| GET    | /api/customers/{id}/debt-summary | Borç özeti |

### Loans
| Method | Endpoint                  | Açıklama                    |
|--------|---------------------------|----------------------------|
| GET    | /api/loans/{id}           | Kredi detayı               |
| GET    | /api/loans/customer/{id}  | Müşterinin kredileri       |
| GET    | /api/loans/pending        | Bekleyen başvurular        |
| POST   | /api/loans                | Admin kredi oluştur        |
| POST   | /api/loans/apply          | Müşteri kredi başvurusu    |
| PATCH  | /api/loans/{id}/approve   | Başvuruyu onayla           |
| PATCH  | /api/loans/{id}/reject    | Başvuruyu reddet           |
| PATCH  | /api/loans/{id}/status    | Kredi durumunu güncelle    |

### Installments
| Method | Endpoint                      | Açıklama                  |
|--------|-------------------------------|--------------------------|
| GET    | /api/installments/loan/{id}   | Kredinin taksit planı    |

### Payments
| Method | Endpoint           | Açıklama         |
|--------|--------------------|-----------------|
| GET    | /api/payments/{id} | Ödeme detayı    |
| POST   | /api/payments      | Taksit ödemesi  |

---

## 🔄 Kredi Oluşturma → Taksit Üretme Akışı

## 🤖 AI Destekli Geliştirme

Bu projede yapay zeka araçları, geliştirme sürecinde yardımcı asistan olarak kullanılmıştır. Özellikle Claude ve ChatGPT; kod iskeleti oluşturma, hata ayıklama, refactoring önerileri, validation kuralları ve dokümantasyon hazırlığı gibi alanlarda destek amaçlı kullanılmıştır.

### Kullanım Alanları

| Alan | Açıklama |
|------|----------|
| Kod iskeleti | Entity, DTO, use case ve React component yapılarının başlangıç taslakları için destek alındı. |
| Hata ayıklama | Build hataları, namespace problemleri, CORS, port, API bağlantısı ve frontend/backend uyumsuzlukları analiz edildi. |
| Refactoring | Kod okunabilirliği, component ayrımı ve validasyon yapıları için öneriler alındı. |
| Validation kuralları | TC kimlik numarası, telefon numarası, şifre güvenliği ve form kontrolleri için öneriler değerlendirildi. |
| API tasarımı | REST endpoint yapısı, müşteri-kredi-taksit-ödeme akışı ve kredi başvuru süreci için fikir alındı. |
| Dokümantasyon | README, akış açıklamaları ve AI kullanımı bölümü için metin desteği alındı. |

### Yaklaşım

Yapay zeka tarafından üretilen çıktılar doğrudan kopyala-yapıştır mantığıyla kullanılmamıştır. Her öneri:

- Proje gereksinimleriyle karşılaştırılmıştır.
- Kod yapısına uygun olacak şekilde düzenlenmiştir.
- Çalıştırılarak test edilmiştir.
- Hatalı veya proje kapsamına uymayan kısımlar değiştirilmiştir.

Kredi başvurusu, taksit üretimi, ödeme akışı, kredi skoru mock servisi, katmanlı mimari kararları ve veri modeli proje gereksinimlerine göre gözden geçirilerek uygulanmıştır.
