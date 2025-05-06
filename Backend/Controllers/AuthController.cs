using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Backend.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Controllers 
{
    [Route("Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly TokenService _token;
        private readonly EmailService _emailService;

        public AuthController(AuthDbContext context, TokenService token, EmailService emailService)
        {
            _context = context;
            _token = token;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<object>> Register(RegisterDTO register)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Users.AnyAsync(u => u.Email == register.Email))
            {
                return Conflict("User with this email already exists.");
            }

            string membershipId = System.Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();

            var user = new User
            {
                Email = register.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password),
                FirstName = register.FirstName,
                LastName = register.LastName,
                MembershipId = membershipId,
                Role = await _context.Users.AnyAsync() ? "User" : "Admin",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            try
            {
                await _emailService.SendWelcomeEmailAsync(user.Email, user.FirstName, user.MembershipId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send welcome email: {ex.Message}");
            }

            var token = _token.GenerateToken(user);

            return Ok(new
            {
                Token = token,
                User = new UserDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    Role = user.Role,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    MembershipId = user.MembershipId,
                    CreatedAt = user.CreatedAt
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDTO login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }

            var token = _token.GenerateToken(user);

            return Ok(new
            {
                Token = token,
                User = new UserDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    Role = user.Role,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    MembershipId = user.MembershipId,
                    CreatedAt = user.CreatedAt
                }
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"Token Claims: {string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}"))}");
            Console.WriteLine($"UserIdClaim: {userIdClaim}");

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                Console.WriteLine("Invalid user ID in token.");
                return Unauthorized(new { error = "Invalid user ID in token." });
            }

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    Email = u.Email,
                    Role = u.Role,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    MembershipId = u.MembershipId,
                    Phone = u.Phone,
                    Bio = u.Bio,
                    ProfileImageUrl = u.ProfileImageUrl,
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                Console.WriteLine($"User not found for ID: {userId}");
                return NotFound(new { error = "User not found." });
            }

            return Ok(user);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileDTO profile)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { error = "Invalid user ID in token." });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found." });
            }

            user.FirstName = profile.FirstName;
            user.LastName = profile.LastName;
            user.Email = profile.Email;
            user.Phone = profile.Phone;
            user.Bio = profile.Bio;

            if (await _context.Users.AnyAsync(u => u.Email == profile.Email && u.Id != userId))
            {
                return Conflict(new { error = "Email is already in use." });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile updated successfully." });
        }

        [Authorize]
        [HttpPut("password")]
        public async Task<ActionResult> UpdatePassword([FromBody] UpdatePasswordDTO password)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { error = "Invalid user ID in token." });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found." });
            }

            if (!BCrypt.Net.BCrypt.Verify(password.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { error = "Current password is incorrect." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password.NewPassword);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully." });
        }
    }
}