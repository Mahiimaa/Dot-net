// Backend/DTO/LoginDTO.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class LoginDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
}