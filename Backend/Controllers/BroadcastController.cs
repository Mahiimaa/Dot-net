using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BroadcastController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public BroadcastController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestBroadcast()
        {
            try
            {
                // Fetch the latest message from the last 24 hours
                var cutoffTime = DateTime.UtcNow.AddHours(-24);
                var latestMessage = await _context.BroadcastMessages
                    .Where(m => m.CreatedAt >= cutoffTime)
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => new { m.Message, m.CreatedAt })
                    .FirstOrDefaultAsync();

                if (latestMessage == null)
                    return Ok(new { message = "" });

                return Ok(new { message = latestMessage.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching latest broadcast: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to fetch broadcast message", details = ex.Message });
            }
        }
    }
}