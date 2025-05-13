using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public WishlistController(AuthDbContext context)
        {
            _context = context;
        }

        // Add book to wishlist
        [HttpPost("add")]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistDTO wishlistDTO)
        {
            var exists = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == wishlistDTO.UserId && w.BookId == wishlistDTO.BookId);

            if (exists != null)
            {
                return BadRequest(new { message = "Book is already in wishlist" });
            }

            var wishlist = new Wishlist
            {
                UserId = wishlistDTO.UserId,
                BookId = wishlistDTO.BookId
            };

            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book added to wishlist" });
        }

        // Get user's wishlist
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserWishlist(int userId)
        {
            try
            {
                var wishlist = await _context.Wishlists
                    .Where(w => w.UserId == userId)
                    .Include(w => w.Book)
                    .Select(w => new
                    {
                        Id = w.Id,
                        UserId = w.UserId,
                        BookId = w.BookId,
                        Book = w.Book != null ? new
                        {
                            Title = w.Book.Title ?? "Untitled",
                            Price = w.Book.Price,
                            ImageUrl = w.Book.ImageUrl,
                            Availability = w.Book.Availability 
                        } : null
                    })
                    .ToListAsync();

                Console.WriteLine($"Fetched {wishlist.Count} wishlist items for user {userId}");
                return Ok(wishlist);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching wishlist: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to fetch wishlist", details = ex.Message });
            }
        }

        // Remove book from wishlist
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveFromWishlist(int id)
        {
            var wishlistItem = await _context.Wishlists.FindAsync(id);

            if (wishlistItem == null)
            {
                return NotFound(new { message = "Wishlist item not found" });
            }

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book removed from wishlist" });
        }
    }
}