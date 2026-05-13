using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Domain.Entities;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.Application.UseCases.Payments
{
    // Tek sorumluluğu: taksit ödemesi yapmak.
    // PDF'te belirtildi: ödeme yapılınca taksidin durumu "Ödendi" olmalı.
    public class CreatePaymentUseCase
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IInstallmentRepository _installmentRepository;
        private readonly ILoanRepository _loanRepository;
        private readonly IMockPaymentService _mockPaymentService;

        public CreatePaymentUseCase(
            IPaymentRepository paymentRepository,
            IInstallmentRepository installmentRepository,
            ILoanRepository loanRepository,
            IMockPaymentService mockPaymentService)
        {
            _paymentRepository = paymentRepository;
            _installmentRepository = installmentRepository;
            _loanRepository = loanRepository;
            _mockPaymentService = mockPaymentService;
        }

        public async Task<PaymentDto> ExecuteAsync(CreatePaymentDto dto)
        {
            // 1. Taksit var mı kontrol et
            var installment = await _installmentRepository.GetByIdAsync(dto.InstallmentId);
            if (installment == null)
                throw new KeyNotFoundException($"ID {dto.InstallmentId} ile taksit bulunamadı.");

            // 2. Taksit zaten ödendi mi kontrol et
            if (installment.Status == InstallmentStatus.Odendi)
                throw new InvalidOperationException("Bu taksit zaten ödenmiş.");

            // 3. Ödeme tutarı taksit tutarıyla eşleşiyor mu kontrol et
            if (dto.AmountPaid != installment.Amount)
                throw new ArgumentException(
                    $"Ödeme tutarı taksit tutarıyla eşleşmiyor. " +
                    $"Beklenen: {installment.Amount}, Gelen: {dto.AmountPaid}");

            // 4. Mock ödeme servisi üzerinden işlemi gerçekleştir
            // Gerçek hayatta burası Iyzico / PayTR API'sine istek atar
            var transactionRef = await _mockPaymentService
                .ProcessPaymentAsync(dto.AmountPaid, $"Taksit #{installment.InstallmentNumber} ödemesi");

            // 5. Payment kaydı oluştur
            var payment = new Payment
            {
                InstallmentId = dto.InstallmentId,
                AmountPaid = dto.AmountPaid,
                PaymentDate = DateTime.UtcNow,
                TransactionReference = transactionRef
            };

            var createdPayment = await _paymentRepository.CreateAsync(payment);

            // 6. Taksidin durumunu "Ödendi" olarak güncelle
            installment.Status = InstallmentStatus.Odendi;
            await _installmentRepository.UpdateAsync(installment);

            // 7. Kredinin tüm taksitleri ödendi mi kontrol et → krediyi kapat
            await CheckAndCloseLoanAsync(installment.LoanId);

            return new PaymentDto
            {
                Id = createdPayment.Id,
                InstallmentId = createdPayment.InstallmentId,
                AmountPaid = createdPayment.AmountPaid,
                PaymentDate = createdPayment.PaymentDate,
                TransactionReference = createdPayment.TransactionReference
            };
        }

        // Tüm taksitler ödendiyse krediyi otomatik kapat
        private async Task CheckAndCloseLoanAsync(int loanId)
        {
            var installments = await _installmentRepository.GetByLoanIdAsync(loanId);

            // Hâlâ ödenmemiş taksit var mı?
            var hasUnpaid = installments.Any(i => i.Status != InstallmentStatus.Odendi);

            if (!hasUnpaid)
            {
                // Tüm taksitler ödendi → krediyi kapat
                var loan = await _loanRepository.GetByIdAsync(loanId);
                if (loan != null)
                {
                    loan.Status = LoanStatus.Kapatildi;
                    await _loanRepository.UpdateAsync(loan);
                }
            }
        }
    }
}