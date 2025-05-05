// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Backend.Data;
// using Backend.Model;
// using System.Security.Claims;
// using System.Threading.Tasks;
<<<<<<< HEAD
=======
<<<<<<< HEAD

// [Route("api/[controller]")]
// [ApiController]
// [Authorize]
// public class CartController : ControllerBase
// {
//     private readonly AuthDbContext _context;

//     public CartController(AuthDbContext context)
//     {
//         _context = context;
//     }

//     [HttpPost]
//     public async Task<IActionResult> AddToCart([FromBody] CartDTO dto)
//     {
//         var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
//         var book = await _context.Books.FindAsync(dto.BookId);
//         if (book == null || book.InStockQty <= book.ReservedQty)
//             return BadRequest("Book is unavailable.");

//         var existingCartItem = await _context.Carts
//             .FirstOrDefaultAsync(c => c.UserId == userId && c.BookId == dto.BookId);
//         if (existingCartItem != null)
//         {
//             existingCartItem.Quantity += 1;
//         }
//         else
//         {
//             var cartItem = new Cart
//             {
//                 UserId = userId,
//                 BookId = dto.BookId,
//                 Quantity = 1,
//                 AddedAt = DateTime.UtcNow
//             };
//             _context.Carts.Add(cartItem);
//         }

//         book.ReservedQty += 1;
//         await _context.SaveChangesAsync();

//         return Ok(new { Message = "Book added to cart" });
//     }
// }

// public class CartDTO
// {
//     public int BookId { get; set; }
// }
=======
>>>>>>> 3363d76d12ef93236d4a5a22be94c3cbeed93120

// [Route("api/[controller]")]
// [ApiController]
// [Authorize]
// public class CartController : ControllerBase
// {
//     private readonly AuthDbContext _context;

//     public CartController(AuthDbContext context)
//     {
//         _context = context;
//     }

//     [HttpPost]
//     public async Task<IActionResult> AddToCart([FromBody] CartDTO dto)
//     {
//         var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
//         var book = await _context.Books.FindAsync(dto.BookId);
//         if (book == null || book.InStockQty <= book.ReservedQty)
//             return BadRequest("Book is unavailable.");

//         var existingCartItem = await _context.Carts
//             .FirstOrDefaultAsync(c => c.UserId == userId && c.BookId == dto.BookId);
//         if (existingCartItem != null)
//         {
//             existingCartItem.Quantity += 1;
//         }
//         else
//         {
//             var cartItem = new Cart
//             {
//                 UserId = userId,
//                 BookId = dto.BookId,
//                 Quantity = 1,
//                 AddedAt = DateTime.UtcNow
//             };
//             _context.Carts.Add(cartItem);
//         }

//         book.ReservedQty += 1;
//         await _context.SaveChangesAsync();

//         return Ok(new { Message = "Book added to cart" });
//     }
// }

// public class CartDTO
// {
//     public int BookId { get; set; }
// }

using Backend.DTO;
using Backend.Model;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Book) // To get book details too
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(cart);
        }

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
<<<<<<< HEAD
=======
>>>>>>> 523b181 (Backend work for wishlist)
>>>>>>> 3363d76d12ef93236d4a5a22be94c3cbeed93120
