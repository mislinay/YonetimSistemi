using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Loans
{
    public class GetPendingLoansUseCase
    {
        private readonly ILoanRepository _loanRepository;

        public GetPendingLoansUseCase(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
        }

        public async Task<IEnumerable<LoanDto>> ExecuteAsync()
        {
            var loans = await _loanRepository.GetPendingLoansAsync();

            return loans.Select(l => new LoanDto
            {
                Id               = l.Id,
                CustomerId       = l.CustomerId,
                CustomerFullName = $"{l.Customer.FirstName} {l.Customer.LastName}",
                LoanType         = l.LoanType.ToString(),
                PrincipalAmount  = l.PrincipalAmount,
                ProfitRate     = l.ProfitRate,
                TermInMonths     = l.TermInMonths,
                StartDate        = l.StartDate,
                Status           = l.Status.ToString(),
                CreatedAt        = l.CreatedAt,
                CreditScore      = l.CreditScore,
            });
        }
    }
}