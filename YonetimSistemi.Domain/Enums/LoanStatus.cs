namespace YonetimSistemi.Domain.Enums
{
    // Kredinin mevcut durumunu tutar.
    public enum LoanStatus
    {
        Aktif = 1,      // Devam eden kredi
        Beklemede  = 0,
        Kapatildi = 2, // Tüm taksitler ödendi veya kapatıldı
        Reddedildi = 3
    }
}