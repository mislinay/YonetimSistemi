using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;

namespace YonetimSistemi.Application.UseCases.Customers
{
    //  yeni müşteri oluşturmak.

    public class CreateCustomerUseCase
    {
        private readonly ICustomerRepository _customerRepository;

        public CreateCustomerUseCase(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<CustomerDto> ExecuteAsync(CreateCustomerDto dto)
        {

            if (dto.Email == "admin@yonetimbank.com")
                throw new InvalidOperationException("Bu email adresi kullanılamaz.");

            // Şifre validasyonu
            if (dto.Password.Length < 8)
                throw new ArgumentException("Şifre en az 8 karakter olmalıdır.");

            if (!dto.Password.Any(char.IsUpper))
                throw new ArgumentException("Şifre en az 1 büyük harf içermelidir.");

            if (!dto.Password.Any(char.IsLower))
                throw new ArgumentException("Şifre en az 1 küçük harf içermelidir.");

            if (!dto.Password.Any(char.IsDigit))
                throw new ArgumentException("Şifre en az 1 rakam içermelidir.");

            if (!dto.Password.Any(c => "!@#$%^&*.,;:?-_".Contains(c)))
                throw new ArgumentException("Şifre en az 1 özel karakter içermelidir.");

            // 1. Aynı IdentityNumber ile müşteri var mı kontrol et
            var existingByIdentity = await _customerRepository
                .GetByIdentityNumberAsync(dto.IdentityNumber);

            if (existingByIdentity != null)
                throw new InvalidOperationException("Bu kimlik numarası zaten kayıtlı.");

            // 2. Aynı email ile müşteri var mı kontrol et
            var existingByEmail = await _customerRepository
                .GetByEmailAsync(dto.Email);

            if (existingByEmail != null)
                throw new InvalidOperationException("Bu email adresi zaten kayıtlı.");

            var existingPhone = await _customerRepository.GetByPhoneNumberAsync(dto.PhoneNumber);
            if (existingPhone != null)
                throw new InvalidOperationException("Bu telefon numarası zaten kayıtlı.");

            // 3. Şifreyi BCrypt ile hashle, düz metin veritabanına girmez
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 4. DTO → Entity dönüşümü
            var customer = new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IdentityNumber = dto.IdentityNumber,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow
            };

            // 5. Veritabanına kaydet
            var created = await _customerRepository.CreateAsync(customer);

            // 6. Entity → DTO dönüşümü yaparak döndür (PasswordHash dışarıya çıkmaz)
            return MapToDto(created);
        }

        // Entity'yi DTO'ya çeviren yardımcı metot
        private CustomerDto MapToDto(Customer customer) => new CustomerDto
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