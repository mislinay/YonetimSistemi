using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.UseCases.Loans
{
    public class RejectLoanUseCase
    {
        private readonly ILoanRepository _loanRepository;
        private readonly ICustomerRepository _customerRepository;

        public RejectLoanUseCase(
            ILoanRepository loanRepository,
            ICustomerRepository customerRepository)
        {
            _loanRepository = loanRepository;
            _customerRepository = customerRepository;
        }

        public async Task<LoanDto> ExecuteAsync(int loanId)
        {
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null)
                throw new KeyNotFoundException("Kredi bulunamadı.");

            if (loan.Status != LoanStatus.Beklemede)
                throw new InvalidOperationException("Sadece beklemedeki başvurular reddedilebilir.");

            loan.Status = LoanStatus.Reddedildi;
            await _loanRepository.UpdateAsync(loan);

            var customer = await _customerRepository.GetByIdAsync(loan.CustomerId);

            return new LoanDto
            {
                Id               = loan.Id,
                CustomerId       = loan.CustomerId,
                CustomerFullName = $"{customer?.FirstName} {customer?.LastName}",
                LoanType         = loan.LoanType.ToString(),
                PrincipalAmount  = loan.PrincipalAmount,
                ProfitRate     = loan.ProfitRate,
                TermInMonths     = loan.TermInMonths,
                StartDate        = loan.StartDate,
                Status           = loan.Status.ToString(),
                CreatedAt        = loan.CreatedAt
            };
        }
    }
}