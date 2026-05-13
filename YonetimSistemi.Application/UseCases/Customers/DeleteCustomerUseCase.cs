using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Customers
{
    // Tek sorumluluğu: müşteriyi silmek.
    public class DeleteCustomerUseCase
    {
        private readonly ICustomerRepository _customerRepository;

        public DeleteCustomerUseCase(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task ExecuteAsync(int id)
        {
            // 1. Müşteri var mı kontrol et
            var customer = await _customerRepository.GetByIdAsync(id);

            if (customer == null)
                throw new KeyNotFoundException($"ID {id} ile müşteri bulunamadı.");

            // 2. Sil (Cascade sayesinde krediler ve taksitler de silinir)
            await _customerRepository.DeleteAsync(customer);
        }
    }
}