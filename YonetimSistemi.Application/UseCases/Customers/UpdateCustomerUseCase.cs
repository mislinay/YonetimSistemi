using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Customers
{
    // Tek sorumluluğu: müşteri bilgilerini güncellemek.
    public class UpdateCustomerUseCase
    {
        private readonly ICustomerRepository _customerRepository;

        public UpdateCustomerUseCase(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<CustomerDto> ExecuteAsync(int id, UpdateCustomerDto dto)
        {
            // 1. Müşteri var mı kontrol et
            var customer = await _customerRepository.GetByIdAsync(id);

            if (customer == null)
                throw new KeyNotFoundException($"ID {id} ile müşteri bulunamadı.");

            // 2. Sadece güncellenebilir alanları değiştir
            // IdentityNumber ve PasswordHash güvenlik nedeniyle buradan değişmez
            customer.FirstName = dto.FirstName;
            customer.LastName = dto.LastName;
            customer.Email = dto.Email;
            customer.PhoneNumber = dto.PhoneNumber;

            // 3. Veritabanına kaydet
            var updated = await _customerRepository.UpdateAsync(customer);

            return new CustomerDto
            {
                Id = updated.Id,
                FirstName = updated.FirstName,
                LastName = updated.LastName,
                IdentityNumber = updated.IdentityNumber,
                Email = updated.Email,
                PhoneNumber = updated.PhoneNumber,
                CreatedAt = updated.CreatedAt
            };
        }
    }
}