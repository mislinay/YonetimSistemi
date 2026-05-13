using System.Collections.Generic;

namespace YonetimSistemi.Domain.Entities
{
    // Bankanın bireysel müşterisini temsil eder.
    public class Customer
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string IdentityNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsAdmin { get; set; } = false;

        // Navigation property: Bu müşteriye ait krediler
        // EF Core bu listeyi otomatik JOIN ile doldurur
        public ICollection<Loan> Loans { get; set; } = new List<Loan>();


    }
}