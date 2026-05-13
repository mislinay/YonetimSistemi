using Microsoft.AspNetCore.Mvc;
using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.UseCases.Customers;

namespace YonetimSistemi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly CreateCustomerUseCase _createCustomerUseCase;
        private readonly GetCustomerUseCase _getCustomerUseCase;
        private readonly GetAllCustomersUseCase _getAllCustomersUseCase;
        private readonly UpdateCustomerUseCase _updateCustomerUseCase;
        private readonly DeleteCustomerUseCase _deleteCustomerUseCase;
        private readonly GetDebtSummaryUseCase _getDebtSummaryUseCase;

        public CustomersController(
            CreateCustomerUseCase createCustomerUseCase,
            GetCustomerUseCase getCustomerUseCase,
            GetAllCustomersUseCase getAllCustomersUseCase,
            UpdateCustomerUseCase updateCustomerUseCase,
            DeleteCustomerUseCase deleteCustomerUseCase,
            GetDebtSummaryUseCase getDebtSummaryUseCase)
        {
            _createCustomerUseCase = createCustomerUseCase;
            _getCustomerUseCase = getCustomerUseCase;
            _getAllCustomersUseCase = getAllCustomersUseCase;
            _updateCustomerUseCase = updateCustomerUseCase;
            _deleteCustomerUseCase = deleteCustomerUseCase;
            _getDebtSummaryUseCase = getDebtSummaryUseCase;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _getAllCustomersUseCase.ExecuteAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _getCustomerUseCase.ExecuteAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto)
        {
            try
            {
                var result = await _createCustomerUseCase.ExecuteAsync(dto);

                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDto dto)
        {
            try
            {
                var result = await _updateCustomerUseCase.ExecuteAsync(id, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _deleteCustomerUseCase.ExecuteAsync(id);

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{id}/debt-summary")]
        public async Task<IActionResult> GetDebtSummary(int id)
        {
            try
            {
                var result = await _getDebtSummaryUseCase.ExecuteAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}