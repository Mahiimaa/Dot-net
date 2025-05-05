using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Model;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public ReviewsController(AuthDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews?bookId={id}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(int bookId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.BookId == bookId)
                .Select(r => new
                {
                    r.Id,
                    r.BookId,
                    r.UserId,
                    r.MemberName,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                })
                .ToListAsync();
            return Ok(reviews);
        }

        // POST: api/Reviews
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var bookExists = await _context.Books.AnyAsync(b => b.Id == review.BookId);
            if (!bookExists)
            {
                return BadRequest(new { error = "Book not found." });
            }

            var hasPurchased = await _context.Orders
                .Include(o => o.OrderItems)
                .AnyAsync(o => o.UserId == userId && o.OrderItems.Any(i => i.BookId == review.BookId));

            if (!hasPurchased)
            {
                return Forbid("You can only review books you have purchased.");
            }
            review.UserId = userId;
            review.CreatedAt = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { id = review.Id });
        }

        // DELETE: api/Reviews/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { error = "Review not found." });
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (review.UserId != userId)
            {
                return Forbid();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpGet("has-purchased/{bookId}")]
        public async Task<IActionResult> HasPurchased(int bookId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var hasPurchased = await _context.Orders
                .Include(o => o.OrderItems)
                .AnyAsync(o =>
                    o.UserId == userId &&
                    o.OrderItems.Any(oi => oi.BookId == bookId) &&
                    o.Status == "Completed" // Optional: only allow after completed payment
                );

            return Ok(new { hasPurchased });
        }

    }
}