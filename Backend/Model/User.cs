using System; 
using System.ComponentModel.DataAnnotations;
using System.Linq;
namespace Backend.Model;

public class User {
    // [key]
    // public int Id {get; set;}
    [Key]
    public int Id { get; set; }

    // [Required]
    // [StringLength(50)]
    // public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "User";

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(8)]
    public string MembershipId { get; set; } = string.Empty;
    public string? ResetOtp { get; set; } // Store the OTP
    public DateTime? OtpExpiration { get; set; } // OTP expiration time
    public string? ProfileImageUrl { get; set; }
    public string? Phone { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsEmailVerified { get; set; }
    public string? VerificationOtp { get; set; }
}

// internal class keyAttribute : Attribute
// {
// }