using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers 
{
    [Route("Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly TokenService _token;

        public AuthController(AuthDbContext context, TokenService token)
        {
            _context = context;
            _token = token;
        }

        [HttpPost("register")]
        public async Task<ActionResult<object>> Register(RegisterDTO register)
        {
            // Validate model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == register.Email))
            {
                return Conflict("User with this email already exists.");
            }

            // Generate unique membership ID
            string membershipId = System.Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();

            // Create new user
            var user = new User
            {
                Email = register.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password),
                FirstName = register.FirstName,
                LastName = register.LastName,
                MembershipId = membershipId,
                Role = await _context.Users.AnyAsync() ? "User" : "Admin"
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Generate JWT token for immediate login
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
                    MembershipId = user.MembershipId
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDTO login)
        {
            // Validate model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == login.Email);

            // Check if user exists and password is correct
            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }

            // Generate JWT token
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
                    MembershipId = user.MembershipId
                }
            });
        }
    }
}