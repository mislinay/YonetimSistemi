using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.UseCases.Customers
{
    public class GetDebtSummaryUseCase
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ILoanRepository _loanRepository;
        private readonly IInstallmentRepository _installmentRepository;

        public GetDebtSummaryUseCase(
            ICustomerRepository customerRepository,
            ILoanRepository loanRepository,
            IInstallmentRepository installmentRepository)
        {
            _customerRepository = customerRepository;
            _loanRepository = loanRepository;
            _installmentRepository = installmentRepository;
        }

        public async Task<DebtSummaryDto> ExecuteAsync(int customerId)
        {
            var customer = await _customerRepository.GetByIdAsync(customerId);
            if (customer == null)
                throw new KeyNotFoundException($"ID {customerId} ile müşteri bulunamadı.");

            var loans = await _loanRepository.GetByCustomerIdAsync(customerId);

            var allInstallments = new List<InstallmentDto>();
            decimal totalDebt = 0;
            decimal remainingPrincipal = 0;
            int overdueCount = 0;

            foreach (var loan in loans)
            {
                var installments = await _installmentRepository.GetByLoanIdAsync(loan.Id);

                // Sadece Aktif kredilerin anaparasını hesapla
                if (loan.Status == LoanStatus.Aktif)
                {
                    var paidCount = installments
                        .Count(i => i.Status == InstallmentStatus.Odendi);

                    var monthlyPrincipal = loan.PrincipalAmount / loan.TermInMonths;

                    remainingPrincipal += loan.PrincipalAmount - (paidCount * monthlyPrincipal);
                }

                foreach (var inst in installments)
                {
                    var instDto = new InstallmentDto
                    {
                        Id = inst.Id,
                        LoanId = inst.LoanId,
                        InstallmentNumber = inst.InstallmentNumber,
                        Amount = inst.Amount,
                        DueDate = inst.DueDate,
                        Status = inst.Status.ToString(),
                        Payment = inst.Payment == null ? null : new PaymentDto
                        {
                            Id = inst.Payment.Id,
                            InstallmentId = inst.Payment.InstallmentId,
                            AmountPaid = inst.Payment.AmountPaid,
                            PaymentDate = inst.Payment.PaymentDate,
                            TransactionReference = inst.Payment.TransactionReference
                        }
                    };

                    allInstallments.Add(instDto);

                    // Toplam borç: ödenmemiş taksitler (faiz dahil)
                    if (inst.Status != InstallmentStatus.Odendi)
                        totalDebt += inst.Amount;

                    // Gecikmiş taksit sayısı
                    if (inst.Status == InstallmentStatus.Gecikmis)
                        overdueCount++;
                }
            }

            return new DebtSummaryDto
            {
                CustomerId = customer.Id,
                FullName = $"{customer.FirstName} {customer.LastName}",
                TotalDebt = totalDebt,
                RemainingPrincipal = remainingPrincipal,
                OverdueInstallmentCount = overdueCount,

                PaidInstallments = allInstallments
                    .Where(i => i.Status == InstallmentStatus.Odendi.ToString())
                    .ToList(),

                UnpaidInstallments = allInstallments
                    .Where(i => i.Status != InstallmentStatus.Odendi.ToString())
                    .ToList()
            };
        }
    }
}