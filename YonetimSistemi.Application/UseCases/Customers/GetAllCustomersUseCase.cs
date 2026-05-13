using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Customers
{
    public class GetAllCustomersUseCase
    {
        private readonly ICustomerRepository _customerRepository;

        public GetAllCustomersUseCase(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<IEnumerable<CustomerDto>> ExecuteAsync()
        {

            // Yeni: GetAllCustomersOnlyAsync()
            var customers = await _customerRepository.GetAllCustomersOnlyAsync();

            return customers.Select(c => new CustomerDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                IdentityNumber = c.IdentityNumber,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                CreatedAt = c.CreatedAt
            });
        }
    }
}