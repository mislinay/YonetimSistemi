namespace YonetimSistemi.Application.DTOs
{
    // Giriş yaparken frontend'den gelen veri
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Giriş başarılıysa frontend'e dönen veri
    public class LoginResultDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // "Admin" veya "Customer" rolü
        public string Role { get; set; } = string.Empty;
    }
}