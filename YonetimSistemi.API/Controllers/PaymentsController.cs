using Microsoft.AspNetCore.Mvc;
using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.UseCases.Payments;

namespace YonetimSistemi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly CreatePaymentUseCase _createPaymentUseCase;
        private readonly GetPaymentUseCase _getPaymentUseCase;

        public PaymentsController(
            CreatePaymentUseCase createPaymentUseCase,
            GetPaymentUseCase getPaymentUseCase)
        {
            _createPaymentUseCase = createPaymentUseCase;
            _getPaymentUseCase = getPaymentUseCase;
        }

        // GET api/payments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _getPaymentUseCase.ExecuteAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // POST api/payments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
        {
            try
            {
                var result = await _createPaymentUseCase.ExecuteAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                // Taksit zaten ödendiyse 409 döner
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // Tutar uyuşmuyorsa 400 döner
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}