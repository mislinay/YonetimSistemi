using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Infrastructure.Services
{
    // Kredi skoru sorgulama servisinin mock (sahte) implementasyonu.
    // Gerçek hayatta bir finans API'sine istek atılırdı.
    // PDF'te "en az 1 dış servis entegrasyonu" istendiği için bu mock yeterli.
    public class MockCreditScoreService : IMockCreditScoreService
    {
        // Random nesnesi: her sorguda farklı skor üretmek için
        private readonly Random _random = new Random();

        public async Task<int> GetCreditScoreAsync(string identityNumber)
        {
            // Gerçek bir API çağrısı simüle etmek için kısa bir bekleme
            await Task.Delay(300);

            // Türkiye'de kredi skoru 1-1900 arasındadır
            // Burada 800-1900 arası rastgele bir skor döndürüyoruz
            var score = _random.Next(800, 1901);

            return score;
        }
    }
}