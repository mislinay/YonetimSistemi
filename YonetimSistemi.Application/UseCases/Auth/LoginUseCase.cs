using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Auth
{
    // Tek sorumluluğu: email + şifre doğrulamak ve kullanıcı bilgisi döndürmek.
    public class LoginUseCase
    {
        private readonly ICustomerRepository _customerRepository;

        public LoginUseCase(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<LoginResultDto> ExecuteAsync(LoginDto dto)
        {
            // 1. Email ile müşteri bul
            var customer = await _customerRepository.GetByEmailAsync(dto.Email);

            if (customer == null)
                throw new UnauthorizedAccessException("Email veya şifre hatalı.");

            // 2. BCrypt ile şifreyi doğrula
            var isValid = BCrypt.Net.BCrypt.Verify(dto.Password, customer.PasswordHash);

            if (!isValid)
                throw new UnauthorizedAccessException("Email veya şifre hatalı.");

            // 3. Admin kontrolü: sabit email ile admin rolü atanır
            // Gerçek projede ayrı bir rol tablosu olurdu
            var role = customer.IsAdmin ? "Admin" : "Customer";

            return new LoginResultDto
            {
                CustomerId = customer.Id,
                FullName   = $"{customer.FirstName} {customer.LastName}",
                Email      = customer.Email,
                Role       = role
            };
        }
    }
}