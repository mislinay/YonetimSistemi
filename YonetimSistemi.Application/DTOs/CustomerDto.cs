namespace YonetimSistemi.Application.DTOs
{
    // Müşteri verilerini dışarıya taşıyan DTO.
    // Entity'nin kendisi yerine bu gönderilir → hassas veriler (PasswordHash) çıkmaz.
    public class CustomerDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string IdentityNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    // Yeni müşteri oluştururken frontend'den gelen veri
    public class CreateCustomerDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string IdentityNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;

        // Düz metin şifre → UseCase içinde BCrypt ile hashlenecek
        public string Password { get; set; } = string.Empty;
    }

    // Müşteri güncellerken frontend'den gelen veri
    public class UpdateCustomerDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}