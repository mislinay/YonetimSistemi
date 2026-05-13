using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.DTOs
{
    // Taksit verisini dışarıya taşıyan DTO
    public class InstallmentDto
    {
        public int Id { get; set; }
        public int LoanId { get; set; }
        public int InstallmentNumber { get; set; }
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = string.Empty;

        // Ödeme yapıldıysa ödeme bilgisi de gelsin, yoksa null
        public PaymentDto? Payment { get; set; }
    }
}