using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class VerifyEmailDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits.")]
        public string Otp { get; set; }
    }
}