using Microsoft.EntityFrameworkCore;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;
using YonetimSistemi.Infrastructure.Data;

namespace YonetimSistemi.Infrastructure.Repositories
{
    public class InstallmentRepository : IInstallmentRepository
    {
        private readonly AppDbContext _context;

        public InstallmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Installment>> GetByLoanIdAsync(int loanId)
        {
            // Bir kredinin tüm taksitlerini sıralı getir
            return await _context.Installments
                .Include(i => i.Payment)
                .Where(i => i.LoanId == loanId)
                .OrderBy(i => i.InstallmentNumber) // 1, 2, 3... sırasıyla
                .ToListAsync();
        }

        public async Task<Installment?> GetByIdAsync(int id)
        {
            return await _context.Installments
                .Include(i => i.Payment) // Varsa ödeme bilgisini de getir
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Installment> UpdateAsync(Installment installment)
        {
            _context.Installments.Update(installment);
            await _context.SaveChangesAsync();
            return installment;
        }

        public async Task AddRangeAsync(IEnumerable<Installment> installments)
        {
            // Kredi oluşturulunca tüm taksitler tek seferde eklenir
            await _context.Installments.AddRangeAsync(installments);
            await _context.SaveChangesAsync();
        }
    }
}