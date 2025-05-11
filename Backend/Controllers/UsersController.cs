using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AuthDbContext _context;

    public UsersController(AuthDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Role,
                    u.Email
                })
                .ToListAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching users: {ex.Message}\n{ex.StackTrace}");
            return StatusCode(500, new { error = "Failed to fetch users", details = ex.Message });
        }
    }
}