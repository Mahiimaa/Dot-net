// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Backend.Data;
// using Backend.Model;
// using System.Security.Claims;

// namespace Backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     [Authorize]
//     public class BookmarksController : ControllerBase
//     {
//         private readonly AuthDbContext _context;

//         public BookmarksController(AuthDbContext context)
//         {
//             _context = context;
//         }

//         // GET: api/Bookmarks?bookId={id}
//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<Bookmark>>> GetBookmarks(int? bookId)
//         {
//             var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
//             var query = _context.Bookmarks
//                 .Where(b => b.UserId == userId);

//             if (bookId.HasValue)
//             {
//                 query = query.Where(b => b.BookId == bookId.Value);
//             }

//             var bookmarks = await query
//                 .Select(b => new
//                 {
//                     b.Id,
//                     b.UserId,
//                     b.BookId,
//                     b.BookmarkedAt
//                 })
//                 .ToListAsync();
//             return Ok(bookmarks);
//         }

//         // POST: api/Bookmarks
//         [HttpPost]
//         public async Task<ActionResult<Bookmark>> PostBookmark([FromBody] Bookmark bookmark)
//         {
//             var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
//             var existingBookmark = await _context.Bookmarks
//                 .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == bookmark.BookId);

//             if (existingBookmark != null)
//             {
//                 return Conflict(new { error = "Book is already bookmarked." });
//             }

//             var bookExists = await _context.Books.AnyAsync(b => b.Id == bookmark.BookId);
//             if (!bookExists)
//             {
//                 return BadRequest(new { error = "Book not found." });
//             }

//             bookmark.UserId = userId;
//             bookmark.BookmarkedAt = DateTime.UtcNow;

//             _context.Bookmarks.Add(bookmark);
//             await _context.SaveChangesAsync();

//             return Ok(new { id = bookmark.Id });
//         }

//         // DELETE: api/Bookmarks/{bookId}
//         [HttpDelete("{bookId}")]
//         public async Task<IActionResult> DeleteBookmark(int bookId)
//         {
//             var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
//             var bookmark = await _context.Bookmarks
//                 .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);

//             if (bookmark == null)
//             {
//                 return NotFound(new { error = "Bookmark not found." });
//             }

//             _context.Bookmarks.Remove(bookmark);
//             await _context.SaveChangesAsync();

//             return NoContent();
//         }
//     }
// }