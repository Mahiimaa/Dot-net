using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;


[Route("api/[controller]")]
// [Authorize(Roles = "Admin")]
[ApiController]
public class DiscountsController : ControllerBase
{
    private readonly AuthDbContext _context;
    public DiscountsController(AuthDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var discounts = await _context.Discounts
            .Include(d => d.Books)
            .Select(d => new
            {
                d.Id,
                d.Title,
                d.DiscountPercent,
                d.StartDate,
                d.EndDate,
                d.OnSale,
                BookIds = d.Books.Select(b => b.Id).ToList()
            })
            .ToListAsync();

        return Ok(discounts);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var discount = await _context.Discounts
            .Include(d => d.Books)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (discount == null) return NotFound();

        return Ok(new
        {
            discount.Id,
            discount.Title,
            discount.DiscountPercent,
            discount.StartDate,
            discount.EndDate,
            discount.OnSale,
            BookIds = discount.Books.Select(b => b.Id).ToList()
        });
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DiscountDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var books = await _context.Books
            .Where(b => dto.BookIds.Contains(b.Id))
            .ToListAsync();

        var discount = new Discount
        {
            Title = dto.Title,
            DiscountPercent = dto.DiscountPercent,
            StartDate = dto.StartDate.HasValue
            ? DateTime.SpecifyKind(dto.StartDate.Value, DateTimeKind.Utc)
            : null,
            EndDate = dto.EndDate.HasValue
            ? DateTime.SpecifyKind(dto.EndDate.Value, DateTimeKind.Utc)
            : null,
            OnSale = dto.OnSale,
            Books = books
        };

        _context.Discounts.Add(discount);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            discount.Id,
            discount.Title,
            discount.DiscountPercent,
            discount.StartDate,
            discount.EndDate,
            discount.OnSale,
            BookIds = discount.Books.Select(b => b.Id).ToList()
        });
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DiscountDTO dto)
    {
        var discount = await _context.Discounts
            .Include(d => d.Books)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (discount == null) return NotFound();

        discount.Title = dto.Title;
        discount.DiscountPercent = dto.DiscountPercent;
        discount.StartDate = dto.StartDate.HasValue
        ? DateTime.SpecifyKind(dto.StartDate.Value, DateTimeKind.Utc)
        : null;
        discount.EndDate = dto.EndDate.HasValue
        ? DateTime.SpecifyKind(dto.EndDate.Value, DateTimeKind.Utc)
        : null;
        discount.OnSale = dto.OnSale;

        // Update the many-to-many relationship
        var books = await _context.Books
            .Where(b => dto.BookIds.Contains(b.Id))
            .ToListAsync();

        discount.Books = books;

        await _context.SaveChangesAsync();
        return Ok(new
        {
            discount.Id,
            discount.Title,
            discount.DiscountPercent,
            discount.StartDate,
            discount.EndDate,
            discount.OnSale,
            BookIds = discount.Books.Select(b => b.Id).ToList()
        });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var discount = await _context.Discounts.FindAsync(id);
        if (discount == null) return NotFound();

        _context.Discounts.Remove(discount);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
