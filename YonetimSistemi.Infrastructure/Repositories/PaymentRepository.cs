using Microsoft.EntityFrameworkCore;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;
using YonetimSistemi.Infrastructure.Data;

namespace YonetimSistemi.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Payment?> GetByInstallmentIdAsync(int installmentId)
        {
            // Bu taksit daha önce ödendi mi? kontrol için kullanılır
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.InstallmentId == installmentId);
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments
                .Include(p => p.Installment) // Taksit bilgisini de getir
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Payment> CreateAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }
    }
}