using System;
namespace Backend.DTO;

public class UserDTO {
    public int Id { get; set; }
    // public string Username { get; set; } = string.Empty; 
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; 
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string MembershipId { get; set; } = string.Empty; 
    public string? ProfileImageUrl { get; set; }
    public string? Phone { get; set; } // Added
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }

    

}