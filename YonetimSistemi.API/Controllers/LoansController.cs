using Microsoft.AspNetCore.Mvc;
using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.UseCases.Loans;
using YonetimSistemi.Domain.Enums;

namespace YonetimSistemi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        private readonly GetLoanUseCase _getLoanUseCase;
        private readonly GetLoansByCustomerUseCase _getLoansByCustomerUseCase;
        private readonly UpdateLoanStatusUseCase _updateLoanStatusUseCase;
        private readonly ApplyLoanUseCase _applyLoanUseCase;
        private readonly ApproveLoanUseCase _approveLoanUseCase;
        private readonly RejectLoanUseCase _rejectLoanUseCase;
        private readonly GetPendingLoansUseCase _getPendingLoansUseCase;

        public LoansController(
            GetLoanUseCase getLoanUseCase,
            GetLoansByCustomerUseCase getLoansByCustomerUseCase,
            UpdateLoanStatusUseCase updateLoanStatusUseCase,
            ApplyLoanUseCase applyLoanUseCase,
            ApproveLoanUseCase approveLoanUseCase,
            RejectLoanUseCase rejectLoanUseCase,
            GetPendingLoansUseCase getPendingLoansUseCase)
        {
            _getLoanUseCase = getLoanUseCase;
            _getLoansByCustomerUseCase = getLoansByCustomerUseCase;
            _updateLoanStatusUseCase = updateLoanStatusUseCase;
            _applyLoanUseCase = applyLoanUseCase;
            _approveLoanUseCase = approveLoanUseCase;
            _rejectLoanUseCase = rejectLoanUseCase;
            _getPendingLoansUseCase = getPendingLoansUseCase;
        }

        // GET api/loans/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _getLoanUseCase.ExecuteAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET api/loans/customer/5
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            try
            {
                var result = await _getLoansByCustomerUseCase.ExecuteAsync(customerId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Admin: bekleyen başvuruları listeler
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var result = await _getPendingLoansUseCase.ExecuteAsync();
            return Ok(result);
        }

      
       
        // Müşteri: kredi başvurusu yapar.
        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] ApplyLoanDto dto)
        {
            try
            {
                var result = await _applyLoanUseCase.ExecuteAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PATCH api/loans/5/approve
        // Admin: başvuruyu onaylar, taksitler oluşur
        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            try
            {
                var result = await _approveLoanUseCase.ExecuteAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PATCH api/loans/5/reject
        // Admin: başvuruyu reddeder
        [HttpPatch("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            try
            {
                var result = await _rejectLoanUseCase.ExecuteAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PATCH api/loans/5/status
        // Admin: kredi durumunu günceller
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] LoanStatus status)
        {
            try
            {
                var result = await _updateLoanStatusUseCase.ExecuteAsync(id, status);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}