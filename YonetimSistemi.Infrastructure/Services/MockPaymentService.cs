using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Infrastructure.Services
{
    // Ödeme altyapısının mock (sahte) implementasyonu.
    // Gerçek hayatta Iyzico, PayTR gibi bir ödeme servisine istek atılırdı.
    public class MockPaymentService : IMockPaymentService
    {
        public async Task<string> ProcessPaymentAsync(decimal amount, string description)
        {
            // Gerçek bir ödeme işlemini simüle etmek için bekleme
            await Task.Delay(500);

            // Gerçek sistemlerde ödeme sağlayıcısı bir transaction ID döner
            // Biz burada benzersiz bir referans kodu üretiyoruz
            var transactionReference = $"TXN-{Guid.NewGuid().ToString("N").ToUpper()[..12]}";

            // Örnek çıktı: "TXN-A3F9C12B8E4D"
            return transactionReference;
        }
    }
}