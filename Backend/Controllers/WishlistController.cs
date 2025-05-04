// using Backend.Data;
// using Backend.DTO;
// using Backend.Model;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace Backend.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class WishlistController : ControllerBase
//     {
//         private readonly AuthDbContext _context;

//         public WishlistController(AuthDbContext context)
//         {
//             _context = context;
//         }

//         [HttpPost("add")]
//         public async Task<IActionResult> AddToWishlist([FromBody] WishlistDTO wishlistDTO)
//         {
//             // Check if already in wishlist
//             var existing = await _context.Wishlists
//                 .FirstOrDefaultAsync(w => w.UserId == wishlistDTO.UserId && w.BookId == wishlistDTO.BookId);

//             if (existing != null)
//             {
//                 return BadRequest(new { message = "Book is already in wishlist" });
//             }

//             var wishlistItem = new Wishlist
//             {
//                 BookId = wishlistDTO.BookId,
//                 UserId = wishlistDTO.UserId
//             };

//             _context.Wishlists.Add(wishlistItem);
//             await _context.SaveChangesAsync();

//             return Ok(new { message = "Book added to wishlist" });
//         }

//         [HttpGet("user/{userId}")]
//         public async Task<IActionResult> GetUserWishlist(int userId)
//         {
//             var wishlist = await _context.Wishlists
//                 .Include(w => w.Book) // Optional: only if you have navigation property
//                 .Where(w => w.UserId == userId)
//                 .ToListAsync();

//             return Ok(wishlist);
//         }

//         [HttpDelete("remove/{id}")]
//         public async Task<IActionResult> RemoveFromWishlist(int id)
//         {
//             var item = await _context.Wishlists.FindAsync(id);
//             if (item == null) return NotFound();

//             _context.Wishlists.Remove(item);
//             await _context.SaveChangesAsync();

//             return Ok(new { message = "Book removed from wishlist" });
//         }
//     }
// }

// using Backend.Data;
// using Backend.DTO;
// using Backend.Model;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace Backend.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class WishlistController : ControllerBase
//     {
//         private readonly AuthDbContext _context;

//         public WishlistController(AuthDbContext context)
//         {
//             _context = context;
//         }

//         [HttpPost("add")]
//         public async Task<IActionResult> AddToWishlist([FromBody] WishlistDTO wishlistDTO)
//         {
//             var exists = await _context.Wishlists
//                 .FirstOrDefaultAsync(w => w.UserId == wishlistDTO.UserId && w.BookId == wishlistDTO.BookId);

//             if (exists != null)
//             {
//                 return BadRequest(new { message = "Book is already in wishlist" });
//             }

//             var wishlist = new Wishlist
//             {
//                 UserId = wishlistDTO.UserId,
//                 BookId = wishlistDTO.BookId
//             };

//             _context.Wishlists.Add(wishlist);
//             await _context.SaveChangesAsync();

//             return Ok(new { message = "Book added to wishlist" });
//         }

//         [HttpGet("user/{userId}")]
//         public async Task<IActionResult> GetUserWishlist(int userId)
//         {
//             var wishlist = await _context.Wishlists
//                 .Where(w => w.UserId == userId)
//                 .Include(w => w.Book) // ensure Book navigation property is loaded
//                 .ToListAsync();

//             return Ok(wishlist);
//         }

//         [HttpDelete("remove/{id}")]
//         public async Task<IActionResult> RemoveFromWishlist(int id)
//         {
//             var wishlistItem = await _context.Wishlists.FindAsync(id);

//             if (wishlistItem == null)
//             {
//                 return NotFound(new { message = "Wishlist item not found" });
//             }

//             _context.Wishlists.Remove(wishlistItem);
//             await _context.SaveChangesAsync();

//             return Ok(new { message = "Book removed from wishlist" });
//         }
//     }
// }

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
            var wishlist = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Book) // ensure Book navigation property is loaded
                .ToListAsync();

            return Ok(wishlist);
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
