using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Loans
{
    // Tek sorumluluğu: ID ile kredi getirmek (taksitlerle birlikte).
    public class GetLoanUseCase
    {
        private readonly ILoanRepository _loanRepository;

        public GetLoanUseCase(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        public async Task<LoanDto> ExecuteAsync(int id)
        {
            var loan = await _loanRepository.GetByIdWithInstallmentsAsync(id);

            if (loan == null)
                throw new KeyNotFoundException($"ID {id} ile kredi bulunamadı.");

            return new LoanDto
            {
                Id = loan.Id,
                CustomerId = loan.CustomerId,
                LoanType = loan.LoanType.ToString(),
                PrincipalAmount = loan.PrincipalAmount,
                ProfitRate = loan.ProfitRate,
                TermInMonths = loan.TermInMonths,
                StartDate = loan.StartDate,
                Status = loan.Status.ToString(),
                CreatedAt = loan.CreatedAt
            };
        }
    }
}