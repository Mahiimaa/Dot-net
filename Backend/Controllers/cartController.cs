// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Backend.Data;
// using Backend.Model;
// using System.Security.Claims;
// using System.Threading.Tasks;

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