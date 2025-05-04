using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTO;
using Microsoft.AspNetCore.Authorization;


[Route("api/[controller]")]
// [Authorize(Roles = "Admin")]
[ApiController]
public class InventoryController : ControllerBase
{
    private readonly AuthDbContext _context;

    public InventoryController(AuthDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetInventory()
    {
        var books = await _context.Books
            .Select(b => new {
                b.Id,
                b.Title,
                b.ISBN,
                b.InStockQty,
                b.ReservedQty
            }).ToListAsync();

        return Ok(books);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInventory(int id, [FromBody] UpdateInventoryDTO dto)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        book.InStockQty = dto.InStockQty;
        book.ReservedQty = dto.ReservedQty;
        book.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(book);
    }
}
