using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.UseCases.Installments
{
    // Gecikmiş taksitleri günceller.
    // Son ödeme tarihi geçmiş ve hâlâ ödenmemiş taksitler "Gecikmiş" yapılır.
    // Bu UseCase bir arka plan servisi veya her istek öncesi tetiklenebilir.
    public class UpdateOverdueInstallmentsUseCase
    {
        private readonly IInstallmentRepository _installmentRepository;
        private readonly ILoanRepository _loanRepository;

        public UpdateOverdueInstallmentsUseCase(
            IInstallmentRepository installmentRepository,
            ILoanRepository loanRepository)
        {
            _installmentRepository = installmentRepository;
            _loanRepository = loanRepository;
        }

        public async Task ExecuteAsync(int loanId)
        {
            var installments = await _installmentRepository.GetByLoanIdAsync(loanId);
            var today = DateTime.UtcNow;

            foreach (var installment in installments)
            {
                // Ödenmemiş + son ödeme tarihi geçmişse → Gecikmiş yap
                if (installment.Status == InstallmentStatus.Odenmedi
                    && installment.DueDate < today)
                {
                    installment.Status = InstallmentStatus.Gecikmis;
                    await _installmentRepository.UpdateAsync(installment);
                }
            }
        }
    }
}