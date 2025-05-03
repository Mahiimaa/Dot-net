using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Model;
using System.Security.Claims;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BookmarksController : ControllerBase
{
    private readonly AuthDbContext _context;

    public BookmarksController(AuthDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> BookmarkBook([FromBody] BookmarkDTO dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var book = await _context.Books.FindAsync(dto.BookId);
        if (book == null)
            return BadRequest("Book not found.");

        var existingBookmark = await _context.Bookmarks
            .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == dto.BookId);
        if (existingBookmark != null)
            return Ok(new { Message = "Book already bookmarked" });

        var bookmark = new Bookmark
        {
            UserId = userId,
            BookId = dto.BookId,
            BookmarkedAt = DateTime.UtcNow
        };

        _context.Bookmarks.Add(bookmark);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Book bookmarked" });
    }
}

public class BookmarkDTO
{
    public int BookId { get; set; }
}