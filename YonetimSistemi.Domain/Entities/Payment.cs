namespace YonetimSistemi.Domain.Entities
{
    // Bir taksit için yapılan ödeme kaydı.
    // PDF'e göre: bir ödeme yalnızca tek bir takside ait olabilir.
    public class Payment
    {
        public int Id { get; set; }

        // Hangi taksit için yapıldığı (1-1 ilişki)
        public int InstallmentId { get; set; }
        public Installment Installment { get; set; } = null!;

        // Ödenen tutar (taksit tutarıyla eşleşmeli)
        public decimal AmountPaid { get; set; }

        // Ödemenin yapıldığı tarih
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        // Mock ödeme servisinden dönen referans kodu
        // Gerçek entegrasyonda transaction ID olurdu
        public string? TransactionReference { get; set; }
    }
}