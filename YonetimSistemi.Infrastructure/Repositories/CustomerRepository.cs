using Microsoft.EntityFrameworkCore;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;
using YonetimSistemi.Infrastructure.Data;

namespace YonetimSistemi.Infrastructure.Repositories
{
    // ICustomerRepository interface'inin gerçek EF Core implementasyonu.
    // Veritabanı işlemlerinin tamamı burada yapılır.
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;

        // AppDbContext Dependency Injection ile dışarıdan verilir
        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            // Tüm müşterileri veritabanından çek
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            // ID ile müşteri bul, kredileriyle birlikte getir
            return await _context.Customers
                .Include(c => c.Loans) // JOIN: Loans tablosunu da çek
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Customer?> GetByIdentityNumberAsync(string identityNumber)
        {
            return await _context.Customers
                .FirstOrDefaultAsync(c => c.IdentityNumber == identityNumber);
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<Customer> CreateAsync(Customer customer)
        {
            // EF Core'a "bu nesneyi ekle" diyoruz
            _context.Customers.Add(customer);

            // Değişiklikleri veritabanına yaz (INSERT sorgusu çalışır)
            await _context.SaveChangesAsync();

            return customer;
        }

        public async Task<Customer> UpdateAsync(Customer customer)
        {
            // EF Core'a "bu nesne değişti" diyoruz
            _context.Customers.Update(customer);

            // Değişiklikleri veritabanına yaz (UPDATE sorgusu çalışır)
            await _context.SaveChangesAsync();

            return customer;
        }

        public async Task DeleteAsync(Customer customer)
        {
            _context.Customers.Remove(customer);

            // DELETE sorgusu çalışır
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersOnlyAsync()
        {
            // IsAdmin = false olanları getir
            return await _context.Customers
                .Where(c => !c.IsAdmin)
                .ToListAsync();
        }
    }
}