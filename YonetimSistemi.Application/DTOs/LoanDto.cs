using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.DTOs
{
    // Kredi verilerini dışarıya taşıyan DTO
    public class LoanDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string LoanType { get; set; } = string.Empty;     // Enum → string okunabilir olsun
        public decimal PrincipalAmount { get; set; }
        public decimal ProfitRate { get; set; }
        public int TermInMonths { get; set; }
        public DateTime StartDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string CustomerFullName { get; set; } = string.Empty;
        public int CreditScore { get; set; }
    }

    // Yeni kredi oluştururken frontend'den gelen veri
    public class CreateLoanDto
    {
        public int CustomerId { get; set; }
        public LoanType LoanType { get; set; }
        public decimal PrincipalAmount { get; set; }
        public decimal ProfitRate { get; set; }
        public int TermInMonths { get; set; }
        public DateTime StartDate { get; set; }

        
    }

    public class ApplyLoanDto
   {
       public int CustomerId { get; set; }
       public LoanType LoanType { get; set; }
       public decimal PrincipalAmount { get; set; }
       public decimal ProfitRate { get; set; }
       public int TermInMonths { get; set; }
       public DateTime StartDate { get; set; }
}

}