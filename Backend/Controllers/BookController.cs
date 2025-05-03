using Backend.Data;
using Backend.DTO;
using Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var books = await _context.Books.ToListAsync();
            return Ok(books);
        }

        // GET: api/books/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            return Ok(book);
        }

        // POST: api/books
        [HttpPost]
        public async Task<IActionResult> AddBook([FromForm] BookDTO dto)
        {
            string imageUrl = string.Empty;

            if (dto.Image != null)
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

            var book = new Book
            {
                Title = dto.Title,
                Tags = dto.Tags,
                Author = dto.Author,
                Genre = dto.Genre,
                Language = dto.Language,
                ISBN = dto.ISBN,
                Description = dto.Description,
                Format = dto.Format,
                Price = dto.Price,
                Publisher = dto.Publisher,
                Availability = dto.Availability,
                ImageUrl = imageUrl,
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(book);
        }

        // PUT: api/books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromForm] BookDTO dto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            if (dto.Image != null)
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

            book.Title = dto.Title;
            book.Tags = dto.Tags;
            book.Author = dto.Author;
            book.Genre = dto.Genre;
            book.Language = dto.Language;
            book.ISBN = dto.ISBN;
            book.Description = dto.Description;
            book.Format = dto.Format;
            book.Price = dto.Price;
            book.Publisher = dto.Publisher;
            book.Availability = dto.Availability;
            book.CreatedBy = dto.CreatedBy;
            book.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(book);
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
