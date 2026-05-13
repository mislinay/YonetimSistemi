namespace YonetimSistemi.Application.Interfaces
{
    // PDF'te istenen dış servis entegrasyonu (mock).
    // Kredi skoru sorgulama servisinin sözleşmesi.
    // Gerçek bir API'ye bağlanmak yerine sahte veri döndürecek.
    public interface IMockCreditScoreService
    {
        // IdentityNumber ile müşterinin kredi skorunu sorgular
        // Dönen değer: 0-1900 arası kredi skoru (Türkiye standartı)
        Task<int> GetCreditScoreAsync(string identityNumber);
    }
}