namespace YonetimSistemi.Application.DTOs
{
    // PDF'te istenen "Borç & Özet Görünümü" için DTO.
    // Müşterinin tüm kredi durumunu tek bir endpoint'te özetler.
    public class DebtSummaryDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;

        // Müşterinin tüm kredilerindeki toplam borç
        public decimal TotalDebt { get; set; }

        // Henüz ödenmemiş anapara toplamı
        public decimal RemainingPrincipal { get; set; }

        // Son ödeme tarihi geçmiş ve hâlâ ödenmemiş taksit sayısı
        public int OverdueInstallmentCount { get; set; }

        // Ödenen taksitlerin listesi
        public List<InstallmentDto> PaidInstallments { get; set; } = new();

        // Ödenmemiş taksitlerin listesi (gecikmiş dahil)
        public List<InstallmentDto> UnpaidInstallments { get; set; } = new();
    }
}