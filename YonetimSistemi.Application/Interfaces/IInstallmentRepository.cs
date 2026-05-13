using YonetimSistemi.Domain.Entities;

namespace YonetimSistemi.Application.Interfaces
{
    // Installment (taksit) tablosu için veritabanı işlemlerinin sözleşmesi.
    public interface IInstallmentRepository
    {
        // Bir krediye ait tüm taksitleri getir
        Task<IEnumerable<Installment>> GetByLoanIdAsync(int loanId);

        // ID'ye göre tek taksit getir
        Task<Installment?> GetByIdAsync(int id);

        // Taksit durumunu güncelle (Ödendi / Gecikmiş vs.)
        Task<Installment> UpdateAsync(Installment installment);

        // Toplu taksit kaydetme: kredi oluşturulunca tüm taksitler bir anda eklenir
        Task AddRangeAsync(IEnumerable<Installment> installments);
    }
}