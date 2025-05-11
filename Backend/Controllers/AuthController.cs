using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Backend.Services;
using System.Security.Claims;
using System.Security.Cryptography;


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
            if (register.Password != register.ConfirmPassword)
            {
                Console.WriteLine("Passwords do not match.");
                return BadRequest(new { message = "Passwords do not match." });
            }

            if (register.Password.Length < 8)
            {
                Console.WriteLine("Password too short.");
                return BadRequest(new { message = "Password must be at least 8 characters long." });
            }

            if (await _context.Users.AnyAsync(u => u.Email == register.Email))
            {
                return Conflict("User with this email already exists.");
            }

            string membershipId = System.Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
            string otp = GenerateOtp();

            var user = new User
            {
                Email = register.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password),
                FirstName = register.FirstName,
                LastName = register.LastName,
                MembershipId = membershipId,
                Role = await _context.Users.AnyAsync() ? "User" : "Admin",
                CreatedAt = DateTime.UtcNow,
                IsEmailVerified = false,
                VerificationOtp = otp,
                OtpExpiration = DateTime.UtcNow.AddMinutes(10)
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            try
            {
                await _emailService.SendVerificationEmailAsync(user.Email, user.FirstName, otp);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send verification email: {ex.Message}");
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return StatusCode(500, new { message = "Failed to send verification email. Please try again." });
            }

            return Ok(new { message = "Registration successful. Please verify your email with the OTP sent." });
        }

        [HttpPost("verify-email")]
        public async Task<ActionResult<object>> VerifyEmail(VerifyEmailDTO model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.IsEmailVerified)
            {
                return BadRequest("Email is already verified.");
            }

            if (user.VerificationOtp != model.Otp || user.OtpExpiration < DateTime.UtcNow)
            {
                return BadRequest("Invalid or expired OTP.");
            }

            user.IsEmailVerified = true;
            user.VerificationOtp = null;
            user.OtpExpiration = null;
            await _context.SaveChangesAsync();

            var token = _token.GenerateToken(user);

            try
            {
                await _emailService.SendWelcomeEmailAsync(user.Email, user.FirstName, user.MembershipId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send welcome email: {ex.Message}");
            }

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

        [HttpPost("resend-otp")]
        public async Task<ActionResult<object>> ResendOtp([FromBody] ResendOtpDTO request)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (user.IsEmailVerified)
            {
                return BadRequest(new { message = "Email is already verified." });
            }

            // Generate new OTP
            string otp = new Random().Next(100000, 999999).ToString();
            user.VerificationOtp = otp;
            user.OtpExpiration = DateTime.UtcNow.AddMinutes(10);
            await _context.SaveChangesAsync();

            try
            {
                await _emailService.SendVerificationEmailAsync(user.Email, user.FirstName, otp);
                return Ok(new { message = "OTP resent successfully. Please check your email." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send verification email: {ex.Message}");
                return StatusCode(500, new { message = "Failed to send OTP. Please try again later." });
            }
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
            if (!user.IsEmailVerified)
            {
                return BadRequest("Please verify your email before logging in.");
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
        private string GenerateOtp()
        {
            byte[] randomBytes = new byte[4];
            RandomNumberGenerator.Fill(randomBytes);
            int number = BitConverter.ToInt32(randomBytes, 0) & 0x7FFFFFFF;
            return (number % 900000 + 100000).ToString();
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("assign-staff/{userId}")]
        public async Task<IActionResult> AssignStaffRole(int userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { error = "User identity not found." });
            }

            var currentUserId = int.Parse(userIdClaim.Value);
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Unauthorized(new { error = "Only admins can assign staff roles." });
            }

            var userToUpdate = await _context.Users.FindAsync(userId);
            if (userToUpdate == null)
            {
                return NotFound(new { error = "User not found." });
            }

            if (userToUpdate.Role == "Admin")
            {
                return BadRequest(new { error = "Cannot change the role of an admin." });
            }

            userToUpdate.Role = "Staff";
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {userToUpdate.FirstName} {userToUpdate.LastName} has been assigned the Staff role." });
        }
        
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("remove-staff/{userId}")]
        public async Task<IActionResult> RemoveStaffRole(int userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { error = "User identity not found." });
            }
            var currentUserId = int.Parse(userIdClaim.Value);
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Unauthorized(new { error = "Only admins can remove staff role." });
            }

            var userToUpdate = await _context.Users.FindAsync(userId);
            if (userToUpdate == null)
            {
                return NotFound(new { error = "User not found." });
            }

            if (userToUpdate.Role != "Staff")
            {
                return BadRequest(new { error = "User is not a staff member." });
            }

            userToUpdate.Role = "User"; 
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {userToUpdate.FirstName} {userToUpdate.LastName}'s staff role has been removed." });
        }
    }
}