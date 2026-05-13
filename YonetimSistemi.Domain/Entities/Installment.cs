using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Domain.Entities
{

    public class Installment
    {
        public int Id { get; set; }

        public int LoanId { get; set; }
        public Loan Loan { get; set; } = null!;

        // 1, 2, 3 ... şeklinde taksit numarası
        public int InstallmentNumber { get; set; }

        // Her ay ödenecek sabit taksit tutarı
        public decimal Amount { get; set; }

        // Bu taksidin son ödeme tarihi
        public DateTime DueDate { get; set; }

        // Ödendi / Ödenmedi / Gecikmiş
        public InstallmentStatus Status { get; set; } = InstallmentStatus.Odenmedi;

        // Navigation property: Bu taksit için yapılan ödeme (en fazla 1 adet)
        // null olabilir → henüz ödeme yapılmamışsa
        public Payment? Payment { get; set; }
    }
}