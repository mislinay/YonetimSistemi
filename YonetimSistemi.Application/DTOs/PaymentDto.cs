namespace YonetimSistemi.Application.DTOs
{
    // Ödeme verisini dışarıya taşıyan DTO
    public class PaymentDto
    {
        public int Id { get; set; }
        public int InstallmentId { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime PaymentDate { get; set; }

        // Mock ödeme servisinden dönen referans kodu
        public string? TransactionReference { get; set; }
    }

    // Ödeme yaparken frontend'den gelen veri
    public class CreatePaymentDto
    {
        // Hangi taksit ödenecek
        public int InstallmentId { get; set; }

        // Ödenen tutar
        public decimal AmountPaid { get; set; }
    }
}