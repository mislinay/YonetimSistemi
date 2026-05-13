namespace YonetimSistemi.Application.Interfaces
{
    // PDF'te istenen ikinci dış servis entegrasyonu (mock).
    // Gerçek bir ödeme altyapısı simüle eder.
    public interface IMockPaymentService
    {
        // Ödeme işlemini başlatır
        // Dönen değer: işleme ait benzersiz referans kodu (transaction ID)
        Task<string> ProcessPaymentAsync(decimal amount, string description);
    }
}