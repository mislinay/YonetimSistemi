using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.UseCases.Loans
{
    public class ApplyLoanUseCase
    {
        private readonly ILoanRepository _loanRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IMockCreditScoreService _creditScoreService;

        public ApplyLoanUseCase(
            ILoanRepository loanRepository,
            ICustomerRepository customerRepository,
            IMockCreditScoreService creditScoreService)
        {
            _loanRepository = loanRepository;
            _customerRepository = customerRepository;
            _creditScoreService = creditScoreService;
        }

        public async Task<LoanDto> ExecuteAsync(ApplyLoanDto dto)
        {
            var customer = await _customerRepository.GetByIdAsync(dto.CustomerId);
            if (customer == null)
                throw new KeyNotFoundException("Müşteri bulunamadı.");

            var creditScore = await _creditScoreService.GetCreditScoreAsync(customer.IdentityNumber);
           
            if (dto.PrincipalAmount <= 0)
                throw new ArgumentException("Ana para tutarı sıfırdan büyük olmalıdır.");
            if (dto.TermInMonths <= 0)
                throw new ArgumentException("Vade en az 1 ay olmalıdır.");

            var loan = new Loan
            {
                CustomerId      = dto.CustomerId,
                LoanType        = dto.LoanType,
                PrincipalAmount = dto.PrincipalAmount,
                ProfitRate    = dto.ProfitRate,
                TermInMonths    = dto.TermInMonths,
                StartDate       = dto.StartDate,
                Status          = LoanStatus.Beklemede,
                CreatedAt       = DateTime.UtcNow,
                CreditScore     = creditScore,
            };

            var created = await _loanRepository.CreateAsync(loan);

            return new LoanDto
            {
                Id               = created.Id,
                CustomerId       = created.CustomerId,
                CustomerFullName = $"{customer.FirstName} {customer.LastName}",
                LoanType         = created.LoanType.ToString(),
                PrincipalAmount  = created.PrincipalAmount,
                ProfitRate     = created.ProfitRate,
                TermInMonths     = created.TermInMonths,
                StartDate        = created.StartDate,
                Status           = created.Status.ToString(),
                CreatedAt        = created.CreatedAt,
                CreditScore = created.CreditScore,
            };
        }
    }
}