using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Roles = "Admin")] 
    public class BooksController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BooksController(AuthDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/books
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetBooks(
            [FromQuery] string? search,
            [FromQuery] string? author,
            [FromQuery] string? genre,
            [FromQuery] string? availability,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int? rating,
            [FromQuery] string? language,
            [FromQuery] string? format,
            [FromQuery] string? publisher,
            [FromQuery] string? sortBy,
            [FromQuery] string? tab,
            [FromQuery] bool? isFeatured,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6)
        {
            var query = _context.Books.AsQueryable();

            // Search
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                query = query.Where(b =>
                    b.Title.ToLower().Contains(search) ||
                    b.ISBN.Contains(search) ||
                    b.Description.ToLower().Contains(search));
            }

            // Filters
            if (!string.IsNullOrEmpty(author))
                query = query.Where(b => b.Author == author);
            if (!string.IsNullOrEmpty(genre))
                query = query.Where(b => b.Genre == genre);
            if (!string.IsNullOrEmpty(availability))
                query = query.Where(b => b.Availability == availability);
            if (minPrice.HasValue)
                query = query.Where(b => b.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(b => b.Price <= maxPrice.Value);
            if (rating.HasValue)
                query = query.Where(b => b.Reviews.Any() ? Math.Round(b.Reviews.Average(r => r.Rating)) >= rating.Value : false);
            if (!string.IsNullOrEmpty(language))
                query = query.Where(b => b.Language == language);
            if (!string.IsNullOrEmpty(format))
                query = query.Where(b => b.Format == format);
            if (!string.IsNullOrEmpty(publisher))
                query = query.Where(b => b.Publisher == publisher);
            if (isFeatured.HasValue) 
                query = query.Where(b => b.IsFeatured == isFeatured.Value);

            // Tabs
            if (!string.IsNullOrEmpty(tab))
            {
                switch (tab)
                {
                    case "Bestsellers":
                        query = query.Where(b => b.IsBestseller);
                        break;
                    case "Award Winners":
                        query = query.Where(b => b.IsAwardWinner);
                        break;
                    case "New Releases":
                        query = query.Where(b => b.PublishDate >= DateTime.UtcNow.AddMonths(-3));
                        break;
                    case "New Arrivals":
                        query = query.Where(b => b.CreatedAt >= DateTime.UtcNow.AddMonths(-1));
                        break;
                    case "Coming Soon":
                        query = query.Where(b => b.IsComingSoon);
                        break;
                    case "Deals":
                        query = query.Where(b => b.IsOnSale);
                        break;
                }
            }

            // Sorting
            query = sortBy switch
            {
                "title" => query.OrderBy(b => b.Title),
                "publishDate" => query.OrderByDescending(b => b.PublishDate),
                "priceLow" => query.OrderBy(b => b.Price),
                "priceHigh" => query.OrderByDescending(b => b.Price),
                "popularity" => query.OrderByDescending(b => b.TotalSold),
                _ => query.OrderBy(b => b.Id)
            };

            // Pagination
            var total = await query.CountAsync();
            var books = await query
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.Genre,
                    b.Language,
                    b.ISBN,
                    b.Description,
                    b.Format,
                    b.Price,
                    b.Publisher,
                    b.Availability,
                    b.ImageUrl,
                    b.CreatedBy,
                    b.CreatedAt,
                    b.UpdatedAt,
                    b.InStockQty,
                    b.ReservedQty,
                    b.DiscountPercent,
                    b.DiscountStart,
                    b.DiscountEnd,
                    b.IsOnSale,
                    b.IsBestseller,
                    b.IsAwardWinner,
                    b.IsComingSoon,
                    b.IsFeatured,
                    b.PublishDate,
                    b.TotalSold,
                    Rating = b.Reviews.Any() ? Math.Round(b.Reviews.Average(r => r.Rating)) : 0
                })
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                Total = total,
                Page = page,
                PageSize = pageSize,
                Books = books
            });
        }

        // GET: api/books/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _context.Books
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.Genre,
                    b.Language,
                    b.ISBN,
                    b.Description,
                    b.Format,
                    b.Price,
                    b.Publisher,
                    b.Availability,
                    b.ImageUrl,
                    b.CreatedBy,
                    b.CreatedAt,
                    b.UpdatedAt,
                    b.InStockQty,
                    b.ReservedQty,
                    b.DiscountPercent,
                    b.DiscountStart,
                    b.DiscountEnd,
                    b.IsOnSale,
                    b.IsBestseller,
                    b.IsAwardWinner,
                    b.IsComingSoon,
                    b.IsFeatured,
                    b.PublishDate,
                    b.TotalSold,
                    Rating = b.Reviews.Any() ? Math.Round(b.Reviews.Average(r => r.Rating)) : 0
                })
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null) return NotFound();

            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        public async Task<IActionResult> AddBook([FromForm] BookDTO dto)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Handle image upload
                string imageUrl = string.Empty;
                if (dto.Image != null && dto.Image.Length > 0)
                {
                    try
                    {
                        var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "images");
                        Directory.CreateDirectory(uploadsFolder);
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                        var filePath = Path.Combine(uploadsFolder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await dto.Image.CopyToAsync(stream);
                        }

                        imageUrl = $"images/{fileName}";
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Image upload failed: {ex.Message}");
                        return BadRequest(new { error = "Failed to upload image.", details = ex.Message });
                    }
                }

                // Create book entity
                var book = new Book
                {
                    Title = dto.Title,
                    Tags = dto.Tags ?? string.Empty,
                    Author = dto.Author,
                    Genre = dto.Genre ?? string.Empty,
                    Language = dto.Language ?? string.Empty,
                    ISBN = dto.ISBN ?? string.Empty,
                    Description = dto.Description ?? string.Empty,
                    Format = dto.Format ?? string.Empty,
                    Price = dto.Price,
                    Publisher = dto.Publisher ?? string.Empty,
                    Availability = dto.Availability ?? "Available",
                    ImageUrl = imageUrl,
                    CreatedBy = dto.CreatedBy ?? string.Empty,
                    CreatedAt = DateTime.UtcNow, // Already UTC
                    InStockQty = dto.InStockQty,
                    ReservedQty = dto.ReservedQty,
                    DiscountPercent = dto.DiscountPercent ?? 0,
                    // Convert nullable DateTime fields to UTC if provided
                    DiscountStart = dto.DiscountStart.HasValue ? DateTime.SpecifyKind(dto.DiscountStart.Value, DateTimeKind.Utc) : null,
                    DiscountEnd = dto.DiscountEnd.HasValue ? DateTime.SpecifyKind(dto.DiscountEnd.Value, DateTimeKind.Utc) : null,
                    IsOnSale = dto.IsOnSale,
                    IsBestseller = dto.IsBestseller,
                    IsAwardWinner = dto.IsAwardWinner,
                    IsComingSoon = dto.IsComingSoon,
                    IsFeatured = dto.IsFeatured,
                    PublishDate = dto.PublishDate.HasValue ? DateTime.SpecifyKind(dto.PublishDate.Value, DateTimeKind.Utc) : null,
                    TotalSold = dto.TotalSold ?? 0
                };

                // Save to database
                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                return Ok(book);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("unique constraint") ?? false)
            {
                // Handle duplicate ISBN
                return BadRequest(new { error = "A book with this ISBN already exists." });
            }
            catch (Exception ex)
            {
                // Log general error
                Console.WriteLine($"Error adding book: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "An error occurred while adding the book.", details = ex.Message });
            }
        }

        // PUT: api/books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromForm] BookDTO dto)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var book = await _context.Books.FindAsync(id);
                if (book == null) return NotFound();

                // Handle image upload
                if (dto.Image != null && dto.Image.Length > 0)
                {
                    try
                    {
                        var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "images");
                        Directory.CreateDirectory(uploadsFolder);
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                        var filePath = Path.Combine(uploadsFolder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await dto.Image.CopyToAsync(stream);
                        }

                        book.ImageUrl = $"images/{fileName}";
                    }
                    catch (Exception ex)
                    {
                        // Log image upload error
                        Console.WriteLine($"Image upload failed: {ex.Message}");
                        return BadRequest(new { error = "Failed to upload image.", details = ex.Message });
                    }
                }

                // Update book properties
                book.Title = dto.Title;
                book.Tags = dto.Tags ?? book.Tags;
                book.Author = dto.Author;
                book.Genre = dto.Genre ?? book.Genre;
                book.Language = dto.Language ?? book.Language;
                book.ISBN = dto.ISBN ?? book.ISBN;
                book.Description = dto.Description ?? book.Description;
                book.Format = dto.Format ?? book.Format;
                book.Price = dto.Price;
                book.Publisher = dto.Publisher ?? book.Publisher;
                book.Availability = dto.Availability ?? book.Availability;
                book.CreatedBy = dto.CreatedBy ?? book.CreatedBy;
                book.UpdatedAt = DateTime.UtcNow; // Already UTC
                book.InStockQty = dto.InStockQty;
                book.ReservedQty = dto.ReservedQty;
                book.DiscountPercent = dto.DiscountPercent ?? book.DiscountPercent;
                // Convert nullable DateTime fields to UTC if provided
                book.DiscountStart = dto.DiscountStart.HasValue ? DateTime.SpecifyKind(dto.DiscountStart.Value, DateTimeKind.Utc) : book.DiscountStart;
                book.DiscountEnd = dto.DiscountEnd.HasValue ? DateTime.SpecifyKind(dto.DiscountEnd.Value, DateTimeKind.Utc) : book.DiscountEnd;
                book.IsOnSale = dto.IsOnSale;
                book.IsBestseller = dto.IsBestseller;
                book.IsAwardWinner = dto.IsAwardWinner;
                book.IsComingSoon = dto.IsComingSoon;
                book.IsFeatured = dto.IsFeatured;
                book.PublishDate = dto.PublishDate.HasValue ? DateTime.SpecifyKind(dto.PublishDate.Value, DateTimeKind.Utc) : book.PublishDate;
                book.TotalSold = dto.TotalSold ?? book.TotalSold;

                // Save changes
                await _context.SaveChangesAsync();

                return Ok(book);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("unique constraint") ?? false)
            {
                // Handle duplicate ISBN
                return BadRequest(new { error = "A book with this ISBN already exists." });
            }
            catch (Exception ex)
            {
                // Log general error
                Console.WriteLine($"Error updating book: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "An error occurred while updating the book.", details = ex.Message });
            }
        }

        // DELETE: api/books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}