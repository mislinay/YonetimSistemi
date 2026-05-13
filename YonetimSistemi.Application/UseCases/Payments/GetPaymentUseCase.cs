using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.Interfaces;

namespace YonetimSistemi.Application.UseCases.Payments
{
    // Tek sorumluluğu: ID ile ödeme kaydını getirmek.
    public class GetPaymentUseCase
    {
        private readonly IPaymentRepository _paymentRepository;

        public GetPaymentUseCase(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task<PaymentDto> ExecuteAsync(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);

            if (payment == null)
                throw new KeyNotFoundException($"ID {id} ile ödeme bulunamadı.");

            return new PaymentDto
            {
                Id = payment.Id,
                InstallmentId = payment.InstallmentId,
                AmountPaid = payment.AmountPaid,
                PaymentDate = payment.PaymentDate,
                TransactionReference = payment.TransactionReference
            };
        }
    }
}