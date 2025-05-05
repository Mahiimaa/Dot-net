using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public AuthorsController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthors()
        {
            var authors = await _context.Books
                .Where(b => !string.IsNullOrEmpty(b.Author))
                .GroupBy(b => b.Author)
                .Select(g => new
                {
                    Name = g.Key,
                    TotalBooks = g.Count()
                })
                .ToListAsync();

            return Ok(authors);
        }

        [HttpGet("{author}/books")]
        public async Task<IActionResult> GetBooksByAuthor(string author)
        {
            var books = await _context.Books
                .Where(b => b.Author == author)
                .Select(b => new { b.Id, b.Title, b.PublishDate })
                .ToListAsync();

            return Ok(books);
        }
    }
}
