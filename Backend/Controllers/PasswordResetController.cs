using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Model;
using Backend.Services;
using System;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordResetController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly EmailService _emailService;

        public PasswordResetController(AuthDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // Step 1: Initiate password reset (send OTP)
        [HttpPost("initiate")]
        public async Task<IActionResult> InitiatePasswordReset([FromBody] InitiateResetDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound("No account found with this email.");
            }

            // Generate 6-digit OTP
            var otp = GenerateOtp();
            user.ResetOtp = otp;
            user.OtpExpiration = DateTime.UtcNow.AddMinutes(10); // OTP valid for 10 minutes

            await _context.SaveChangesAsync();

            // Send OTP email
            try
            {
                await _emailService.SendOtpEmailAsync(user.Email, user.FirstName, otp);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send OTP email: {ex.Message}");
                // Continue even if email fails (optional: return a warning)
            }

            return Ok("OTP sent to your email. Please check your inbox or spam folder.");
        }

        // Step 2: Verify OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound("No account found with this email.");
            }

            if (user.ResetOtp != request.Otp || user.OtpExpiration < DateTime.UtcNow)
            {
                return BadRequest("Invalid or expired OTP.");
            }

            // OTP is valid; clear it to prevent reuse
            user.ResetOtp = null;
            user.OtpExpiration = null;
            await _context.SaveChangesAsync();

            return Ok("OTP verified successfully.");
        }

        // Step 3: Reset password
        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound("No account found with this email.");
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok("Password reset successfully.");
        }

        [HttpPost("check-otp-status")]
        public async Task<ActionResult<object>> CheckOtpStatus([FromBody] InitiateResetDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound("No account found with this email.");
            }

            // OTP is considered verified if ResetOtp is null and OtpExpiration is null
            bool isOtpVerified = user.ResetOtp == null && user.OtpExpiration == null;

            return Ok(new { isOtpVerified });
        }

        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(1000, 9999).ToString(); // 4-digit OTP
        }

    }

    public class InitiateResetDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyOtpDto
    {
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}