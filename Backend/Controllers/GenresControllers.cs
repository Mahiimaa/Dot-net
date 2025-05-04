using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenresController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public GenresController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _context.Books
                .Where(b => !string.IsNullOrEmpty(b.Genre))
                .GroupBy(b => b.Genre)
                .Select(g => new
                {
                    Name = g.Key,
                    TotalBooks = g.Count()
                })
                .ToListAsync();

            return Ok(genres);
        }

        [HttpGet("{genreName}/books")]
        public IActionResult GetBooksByGenre(string genreName)
        {
            var books = _context.Books
                .Where(b => b.Genre.ToLower() == genreName.ToLower())
                .ToList();

            return Ok(books);
        }


    }
}
