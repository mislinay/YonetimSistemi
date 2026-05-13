using Microsoft.EntityFrameworkCore;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;
using YonetimSistemi.Infrastructure.Data;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Infrastructure.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly AppDbContext _context;

        public LoanRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Loan>> GetByCustomerIdAsync(int customerId)
        {
            // Sadece bu müşteriye ait kredileri getir
            return await _context.Loans
                .Where(l => l.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<Loan?> GetByIdAsync(int id)
        {
            return await _context.Loans
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Loan?> GetByIdWithInstallmentsAsync(int id)
        {
            // Kredi detay sayfası için taksitlerle birlikte getir
            return await _context.Loans
                .Include(l => l.Installments) // JOIN: taksitler dahil
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Loan> CreateAsync(Loan loan)
        {
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<Loan> UpdateAsync(Loan loan)
        {
            _context.Loans.Update(loan);
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<IEnumerable<Loan>> GetPendingLoansAsync()
        {
            return await _context.Loans
                .Include(l => l.Customer)
                .Where(l => l.Status == LoanStatus.Beklemede)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }
    }
}