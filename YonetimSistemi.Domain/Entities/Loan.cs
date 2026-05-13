using YonetimSistemi.Domain.Enums;
using System.Collections.Generic;

namespace YonetimSistemi.Domain.Entities
{
    // Bir müşteriye ait kredi kaydını temsil eder.
    public class Loan
    {
        public int Id { get; set; }

        // Bu kredinin sahibi müşterinin FK'sı
        public int CustomerId { get; set; }

        // EF Core navigation property → Customer entity'sine erişim sağlar
        public Customer Customer { get; set; } = null!;

        // Kredi türü: İhtiyaç / Eğitim / Taşıt
        public LoanType LoanType { get; set; }

        // Kullanıcının çektiği ana para (örn: 50.000 TL)
        public decimal PrincipalAmount { get; set; }

        // Yıllık kar/faiz oranı (örn: 2.5 → %2.5)
        public decimal ProfitRate { get; set; }

        // Kredi vadesi (ay cinsinden, örn: 12 ay)
        public int TermInMonths { get; set; }

        // Kredinin başlangıç tarihi
        public DateTime StartDate { get; set; }

        // Aktif mi, kapatıldı mı?
        public LoanStatus Status { get; set; } = LoanStatus.Aktif;
        
        // Kredi skoru - başvuru anında sorgulanır ve kaydedilir
        public int CreditScore { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property: Bu krediye ait taksitler
        // Kredi oluşturulunca UseCase içinde otomatik üretilir
        public ICollection<Installment> Installments { get; set; } = new List<Installment>();
    }
}