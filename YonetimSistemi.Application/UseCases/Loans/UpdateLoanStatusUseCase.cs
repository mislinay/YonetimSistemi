using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.UseCases.Loans
{
    // Tek sorumluluğu: kredinin durumunu güncellemek (Aktif → Kapatıldı).
    public class UpdateLoanStatusUseCase
    {
        private readonly ILoanRepository _loanRepository;

        public UpdateLoanStatusUseCase(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        public async Task<LoanDto> ExecuteAsync(int id, LoanStatus newStatus)
        {
            var loan = await _loanRepository.GetByIdAsync(id);

            if (loan == null)
                throw new KeyNotFoundException($"ID {id} ile kredi bulunamadı.");

            // Zaten kapalıysa tekrar kapatma
            if (loan.Status == LoanStatus.Kapatildi && newStatus == LoanStatus.Kapatildi)
                throw new InvalidOperationException("Kredi zaten kapatılmış durumda.");

            loan.Status = newStatus;

            var updated = await _loanRepository.UpdateAsync(loan);

            return new LoanDto
            {
                Id = updated.Id,
                CustomerId = updated.CustomerId,
                LoanType = updated.LoanType.ToString(),
                PrincipalAmount = updated.PrincipalAmount,
                ProfitRate = updated.ProfitRate,
                TermInMonths = updated.TermInMonths,
                StartDate = updated.StartDate,
                Status = updated.Status.ToString(),
                CreatedAt = updated.CreatedAt
            };
        }
    }
}