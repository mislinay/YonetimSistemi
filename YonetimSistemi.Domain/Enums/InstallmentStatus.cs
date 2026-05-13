namespace YonetimSistemi.Domain.Enums
{
    // Bir taksidin ödeme durumunu gösterir.
    public enum InstallmentStatus
    {
        Odenmedi = 1,   // Henüz ödenmemiş
        Odendi = 2,     // Başarıyla ödendi
        Gecikmis = 3    // Son ödeme tarihi geçti, hâlâ ödenmedi
    }
}