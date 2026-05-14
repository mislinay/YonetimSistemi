using Microsoft.EntityFrameworkCore;
using YonetimSistemi.Domain.Entities;

namespace YonetimSistemi.Infrastructure.Data
{
    // EF Core'un ana sınıfı. Veritabanı bağlantısı ve tablolar burada tanımlanır.
    // DbContext, her DbSet'i otomatik olarak bir SQL tablosuna karşılık getirir.
    public class AppDbContext : DbContext
    {
        // Constructor: dışarıdan (Program.cs'den) bağlantı ayarları enjekte edilir
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Her property → veritabanında bir tablo
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<Installment> Installments { get; set; }
        public DbSet<Payment> Payments { get; set; }

        // Tablo ve ilişki konfigürasyonları burada yapılır
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- Customer ---
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasIndex(c => c.IdentityNumber).IsUnique();
                entity.HasIndex(c => c.Email).IsUnique();
                entity.HasIndex(c => c.PhoneNumber).IsUnique();
            });

            // --- Admin Seed Data ---
            modelBuilder.Entity<Customer>().HasData(new Customer
            {
                Id = 999,
                FirstName = "Admin",
                LastName = "User",
                IdentityNumber = "00000000000",
                Email = "admin@yonetimbank.com",
                PhoneNumber = "05000000000",
                PasswordHash = "$2a$11$5pjzsjzNneM.3EmGuKb9VesPZaEDXiFqbXXhBbTR18Eenj5O/ppii",
                IsAdmin = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });


            // --- Loan ---
            modelBuilder.Entity<Loan>(entity =>
            {
                // Ana para ve kar payı oranı için ondalık hassasiyet
                entity.Property(l => l.PrincipalAmount).HasPrecision(18, 2);
                entity.Property(l => l.ProfitRate).HasPrecision(5, 2);

                // Bir müşteri → çok kredi ilişkisi
                entity.HasOne(l => l.Customer)
                      .WithMany(c => c.Loans)
                      .HasForeignKey(l => l.CustomerId)
                      .OnDelete(DeleteBehavior.Cascade); // Müşteri silinince krediler de silinir
            });

            // --- Installment ---
            modelBuilder.Entity<Installment>(entity =>
            {
                entity.Property(i => i.Amount).HasPrecision(18, 2);

                // Bir kredi → çok taksit ilişkisi
                entity.HasOne(i => i.Loan)
                      .WithMany(l => l.Installments)
                      .HasForeignKey(i => i.LoanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // --- Payment ---
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.Property(p => p.AmountPaid).HasPrecision(18, 2);

                // Bir taksit → en fazla bir ödeme (1-1 ilişki)
                // PDF'te belirtildi: "bir ödeme yalnızca tek bir takside ait olabilir"
                entity.HasOne(p => p.Installment)
                      .WithOne(i => i.Payment)
                      .HasForeignKey<Payment>(p => p.InstallmentId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}