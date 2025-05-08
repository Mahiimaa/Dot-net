using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Model;
using Backend.DTO;
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
                    MemberName = r.MemberName ?? "Anonymous",
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
        public async Task<ActionResult<Review>> PostReview([FromBody] ReviewDTO reviewDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            Console.WriteLine("User claims: " + System.Text.Json.JsonSerializer.Serialize(claims));
            var bookExists = await _context.Books.AnyAsync(b => b.Id == reviewDTO.BookId);
            if (!bookExists)
            {
                return BadRequest(new { error = "Book not found." });
            }

            var hasPurchased = await _context.Orders
                .Include(o => o.OrderItems)
                .AnyAsync(o => o.UserId == userId && o.OrderItems.Any(i => i.BookId == reviewDTO.BookId));

            if (!hasPurchased)
            {
                return Forbid("You can only review books you have purchased.");
            }

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.FirstName, u.LastName })
                .FirstOrDefaultAsync();

            var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Anonymous";
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == reviewDTO.BookId);

            if (existingReview != null)
            {
                existingReview.Rating = reviewDTO.Rating;
                existingReview.Comment = reviewDTO.Comment;
                existingReview.CreatedAt = DateTime.UtcNow;
                existingReview.MemberName = userName;
                await _context.SaveChangesAsync();
                return Ok(new { id = existingReview.Id });
            }

            var review = new Review
            {
                BookId = reviewDTO.BookId,
                Rating = reviewDTO.Rating,
                Comment = reviewDTO.Comment,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                MemberName = userName
            };

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
                    o.Status == "Fulfilled" &&
                    o.OrderItems.Any(i => i.BookId == bookId)
                );

            return Ok(new { hasPurchased });
        }

        [Authorize]
        [HttpGet("my-reviews")]
        public async Task<IActionResult> GetMyReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId))
            {
                return Unauthorized(new { error = "Invalid user ID in token." });
            }

            if (page < 1 || pageSize < 1)
            {
                return BadRequest(new { error = "Invalid page or pageSize." });
            }

            var query = _context.Reviews
                .Where(r => r.UserId == userId)
                .GroupJoin(
                    _context.Books,
                    review => review.BookId,
                    book => book.Id,
                    (review, books) => new { review, books })
                .SelectMany(
                    rb => rb.books.DefaultIfEmpty(),
                    (rb, book) => new
                    {
                        rb.review.Id,
                        bookId = rb.review.BookId, // Add bookId to the response
                        rb.review.Rating,
                        reviewText = rb.review.Comment,
                        rb.review.CreatedAt,
                        rb.review.MemberName,
                        title = book != null ? book.Title : "Book Not Found",
                        author = book != null ? book.Author : "Unknown Author",
                        image = book != null ? (book.ImageUrl ?? "https://via.placeholder.com/80x120") : "https://via.placeholder.com/80x120"
                    });

            var totalReviews = await query.CountAsync();
            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { reviews, totalReviews, page, pageSize });
        }
    }
}