using YonetimSistemi.Domain.Entities;

namespace YonetimSistemi.Application.Interfaces
{
    // Payment (ödeme) tablosu için veritabanı işlemlerinin sözleşmesi.
    public interface IPaymentRepository
    {
        // Bir taksite ait ödemeyi getir (varsa)
        Task<Payment?> GetByInstallmentIdAsync(int installmentId);

        // ID'ye göre ödeme getir
        Task<Payment?> GetByIdAsync(int id);

        // Yeni ödeme kaydı oluştur
        Task<Payment> CreateAsync(Payment payment);
    }
}