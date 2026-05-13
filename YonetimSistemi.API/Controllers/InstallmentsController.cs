using Microsoft.AspNetCore.Mvc;
using YonetimSistemi.Application.UseCases.Installments;

namespace YonetimSistemi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstallmentsController : ControllerBase
    {
        private readonly GetInstallmentsByLoanUseCase _getInstallmentsByLoanUseCase;
        private readonly UpdateOverdueInstallmentsUseCase _updateOverdueInstallmentsUseCase;

        public InstallmentsController(
            GetInstallmentsByLoanUseCase getInstallmentsByLoanUseCase,
            UpdateOverdueInstallmentsUseCase updateOverdueInstallmentsUseCase)
        {
            _getInstallmentsByLoanUseCase = getInstallmentsByLoanUseCase;
            _updateOverdueInstallmentsUseCase = updateOverdueInstallmentsUseCase;
        }

        // GET api/installments/loan/5
        // Bir kredinin tüm taksitlerini getirir
        [HttpGet("loan/{loanId}")]
        public async Task<IActionResult> GetByLoan(int loanId)
        {
            try
            {
                // Önce gecikmiş taksitleri güncelle, sonra listele
                await _updateOverdueInstallmentsUseCase.ExecuteAsync(loanId);

                var result = await _getInstallmentsByLoanUseCase.ExecuteAsync(loanId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}