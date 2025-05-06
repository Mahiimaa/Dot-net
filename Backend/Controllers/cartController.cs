using Backend.DTO;
using Backend.Model;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public CartController(AuthDbContext context)
        {
            _context = context;
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartDTO cartDTO)
        {
            // Check if the same book is already in cart for this user
            var existingCartItem = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == cartDTO.UserId && c.BookId == cartDTO.BookId);

            if (existingCartItem != null)
            {
                // If already exists, update quantity
                existingCartItem.Quantity += cartDTO.Quantity;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cart updated with new quantity" });
            }

            var cartItem = new Cart
            {
                BookId = cartDTO.BookId,
                UserId = cartDTO.UserId,
                Quantity = cartDTO.Quantity
            };

            _context.Carts.Add(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book added to cart" });
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserCart(int userId)
        {
            try
            {
                var cart = await _context.Carts
                    .Where(c => c.UserId == userId)
                    .Include(c => c.Book)
                    .Select(c => new
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        BookId = c.BookId,
                        Quantity = c.Quantity,
                        Book = c.Book != null ? new
                        {
                            Title = c.Book.Title ?? "Untitled",
                            Price = c.Book.Price,
                            ImageUrl = c.Book.ImageUrl,
                            Author = c.Book.Author ?? "Unknown",
                            IsOnSale = c.Book.IsOnSale,
                            DiscountPercent = c.Book.DiscountPercent,
                            DiscountStart = c.Book.DiscountStart,
                            DiscountEnd = c.Book.DiscountEnd
                        } : null
                    })
                    .ToListAsync();

                Console.WriteLine($"Fetched {cart.Count} cart items for user {userId}");
                return Ok(cart);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching cart: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to fetch cart", details = ex.Message });
            }
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var item = await _context.Carts.FindAsync(id);
            if (item == null) return NotFound();

            _context.Carts.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book removed from cart" });
        }
    }
}