using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Installments
{
    // Tek sorumluluğu: bir kredinin taksitlerini listelemek.
    public class GetInstallmentsByLoanUseCase
    {
        private readonly IInstallmentRepository _installmentRepository;
        private readonly ILoanRepository _loanRepository;

        public GetInstallmentsByLoanUseCase(
            IInstallmentRepository installmentRepository,
            ILoanRepository loanRepository)
        {
            _installmentRepository = installmentRepository;
            _loanRepository = loanRepository;
        }

        public async Task<IEnumerable<InstallmentDto>> ExecuteAsync(int loanId)
        {
            // Kredi var mı kontrol et
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null)
                throw new KeyNotFoundException($"ID {loanId} ile kredi bulunamadı.");

            var installments = await _installmentRepository.GetByLoanIdAsync(loanId);

            return installments.Select(i => new InstallmentDto
            {
                Id = i.Id,
                LoanId = i.LoanId,
                InstallmentNumber = i.InstallmentNumber,
                Amount = i.Amount,
                DueDate = i.DueDate,
                Status = i.Status.ToString(),
                Payment = i.Payment == null ? null : new PaymentDto
                {
                    Id = i.Payment.Id,
                    InstallmentId = i.Payment.InstallmentId,
                    AmountPaid = i.Payment.AmountPaid,
                    PaymentDate = i.Payment.PaymentDate,
                    TransactionReference = i.Payment.TransactionReference
                }
            });
        }
    }
}