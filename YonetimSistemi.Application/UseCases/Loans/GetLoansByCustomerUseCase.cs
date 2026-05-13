using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Loans
{
    // Tek sorumluluğu: bir müşteriye ait tüm kredileri listelemek.
    public class GetLoansByCustomerUseCase
    {
        private readonly ILoanRepository _loanRepository;
        private readonly ICustomerRepository _customerRepository;

        public GetLoansByCustomerUseCase(
            ILoanRepository loanRepository,
            ICustomerRepository customerRepository)
        {
            _loanRepository = loanRepository;
            _customerRepository = customerRepository;
        }

        public async Task<IEnumerable<LoanDto>> ExecuteAsync(int customerId)
        {
            // Önce müşteri var mı kontrol et
            var customer = await _customerRepository.GetByIdAsync(customerId);
            if (customer == null)
                throw new KeyNotFoundException($"ID {customerId} ile müşteri bulunamadı.");

            var loans = await _loanRepository.GetByCustomerIdAsync(customerId);

            return loans.Select(l => new LoanDto
            {
                Id = l.Id,
                CustomerId = l.CustomerId,
                LoanType = l.LoanType.ToString(),
                PrincipalAmount = l.PrincipalAmount,
                ProfitRate = l.ProfitRate,
                TermInMonths = l.TermInMonths,
                StartDate = l.StartDate,
                Status = l.Status.ToString(),
                CreatedAt = l.CreatedAt
            });
        }
    }
}