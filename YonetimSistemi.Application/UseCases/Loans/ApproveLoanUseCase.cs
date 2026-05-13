using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.UseCases.Loans
{
    public class ApproveLoanUseCase
    {
        private readonly ILoanRepository _loanRepository;
        private readonly IInstallmentRepository _installmentRepository;
        private readonly ICustomerRepository _customerRepository;

        public ApproveLoanUseCase(
            ILoanRepository loanRepository,
            IInstallmentRepository installmentRepository,
            ICustomerRepository customerRepository)
        {
            _loanRepository = loanRepository;
            _installmentRepository = installmentRepository;
            _customerRepository = customerRepository;
        }

        public async Task<LoanDto> ExecuteAsync(int loanId)
        {
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null)
                throw new KeyNotFoundException("Kredi bulunamadı.");

            if (loan.Status != LoanStatus.Beklemede)
                throw new InvalidOperationException("Sadece beklemedeki başvurular onaylanabilir.");

            loan.Status = LoanStatus.Aktif;
            await _loanRepository.UpdateAsync(loan);

            var installments = GenerateInstallments(loan);
            await _installmentRepository.AddRangeAsync(installments);

            var customer = await _customerRepository.GetByIdAsync(loan.CustomerId);

            return new LoanDto
            {
                Id               = loan.Id,
                CustomerId       = loan.CustomerId,
                CustomerFullName = $"{customer?.FirstName} {customer?.LastName}",
                LoanType         = loan.LoanType.ToString(),
                PrincipalAmount  = loan.PrincipalAmount,
                ProfitRate       = loan.ProfitRate,
                TermInMonths     = loan.TermInMonths,
                StartDate        = loan.StartDate,
                Status           = loan.Status.ToString(),
                CreatedAt        = loan.CreatedAt
            };
        }

        private List<Installment> GenerateInstallments(Loan loan)
        {
            var installments = new List<Installment>();
            var monthlyRate = loan.ProfitRate / 100 / 12;

            decimal monthlyPayment;
            if (monthlyRate == 0)
            {
                monthlyPayment = loan.PrincipalAmount / loan.TermInMonths;
            }
            else
            {
                var ratePow = Math.Pow((double)(1 + monthlyRate), loan.TermInMonths);
                monthlyPayment = loan.PrincipalAmount
                    * monthlyRate * (decimal)ratePow
                    / ((decimal)ratePow - 1);
            }

            for (int i = 1; i <= loan.TermInMonths; i++)
            {
                installments.Add(new Installment
                {
                    LoanId            = loan.Id,
                    InstallmentNumber = i,
                    Amount            = Math.Round(monthlyPayment, 2),
                    DueDate           = loan.StartDate.AddMonths(i),
                    Status            = InstallmentStatus.Odenmedi
                });
            }

            return installments;
        }
    }
}