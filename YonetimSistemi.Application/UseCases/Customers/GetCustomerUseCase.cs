using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Customers
{
    public class GetCustomerUseCase
    {
        private readonly ICustomerRepository _customerRepository;

        public GetCustomerUseCase(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<CustomerDto> ExecuteAsync(int id)
        {
            // Müşteriyi veritabanından getir
            var customer = await _customerRepository.GetByIdAsync(id);

            // Bulunamazsa hata fırlat, Controller bunu 404'e çevirecek
            if (customer == null)
                throw new KeyNotFoundException($"ID {id} ile müşteri bulunamadı.");

            return new CustomerDto
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                IdentityNumber = customer.IdentityNumber,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                CreatedAt = customer.CreatedAt
            };
        }
    }
}