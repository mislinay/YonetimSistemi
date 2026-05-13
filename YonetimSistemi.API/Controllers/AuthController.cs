using Microsoft.AspNetCore.Mvc;
using YonetimSistemi.Application.DTOs;
using YonetimSistemi.Application.UseCases.Auth;

namespace YonetimSistemi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LoginUseCase _loginUseCase;

        public AuthController(LoginUseCase loginUseCase)
        {
            _loginUseCase = loginUseCase;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = await _loginUseCase.ExecuteAsync(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}