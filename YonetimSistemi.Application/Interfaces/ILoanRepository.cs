using YonetimSistemi.Domain.Entities;

namespace YonetimSistemi.Application.Interfaces
{
    // Loan (kredi) tablosu için veritabanı işlemlerinin sözleşmesi.
    public interface ILoanRepository
    {
        // Belirli bir müşterinin tüm kredilerini getir
        Task<IEnumerable<Loan>> GetByCustomerIdAsync(int customerId);

        // ID'ye göre tek kredi getir, taksitleriyle birlikte
        Task<Loan?> GetByIdWithInstallmentsAsync(int id);

        // ID'ye göre tek kredi getir (taksitsiz, basit sorgular için)
        Task<Loan?> GetByIdAsync(int id);

        // Yeni kredi oluştur
        Task<Loan> CreateAsync(Loan loan);

        // Kredi güncelle (örn: status değişimi)
        Task<Loan> UpdateAsync(Loan loan);

        Task<IEnumerable<Loan>> GetPendingLoansAsync();

    }
}