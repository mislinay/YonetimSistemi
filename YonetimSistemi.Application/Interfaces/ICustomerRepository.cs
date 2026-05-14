using YonetimSistemi.Domain.Entities;

namespace YonetimSistemi.Application.Interfaces
{
    // Customer tablosu için veritabanı işlemlerinin sözleşmesi (contract).
    // UseCase'ler bu interface'i kullanır, Infrastructure'ı doğrudan görmez.
    // Bu sayede katmanlar birbirinden bağımsız kalır.
    public interface ICustomerRepository
    {
        // Tüm müşterileri listele
        Task<IEnumerable<Customer>> GetAllAsync();

        // ID'ye göre tek müşteri getir, bulunamazsa null döner
        Task<Customer?> GetByIdAsync(int id);

        // IdentityNumber'a göre müşteri getir (benzersizlik kontrolü için)
        Task<Customer?> GetByIdentityNumberAsync(string identityNumber);

        // Email'e göre müşteri getir (login ve benzersizlik kontrolü için)
        Task<Customer?> GetByEmailAsync(string email);

        Task<Customer?> GetByPhoneNumberAsync(string phoneNumber);

        // Yeni müşteri ekle
        Task<Customer> CreateAsync(Customer customer);

        // Mevcut müşteriyi güncelle
        Task<Customer> UpdateAsync(Customer customer);

        // Müşteriyi sil
        Task DeleteAsync(Customer customer);
        Task<IEnumerable<Customer>> GetAllCustomersOnlyAsync();


    }
}