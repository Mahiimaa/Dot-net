using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Model;

[Route("api/[controller]")]
[ApiController]
public class AnnouncementsController : ControllerBase
{
    private readonly AuthDbContext _context;

    public AnnouncementsController(AuthDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var announcements = await _context.Announcements
            .OrderByDescending(a => a.StartDate)
            .ToListAsync();
        return Ok(announcements);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Announcement announcement)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (announcement.StartDate.HasValue)
        announcement.StartDate = DateTime.SpecifyKind(announcement.StartDate.Value, DateTimeKind.Utc);

        if (announcement.EndDate.HasValue)
            announcement.EndDate = DateTime.SpecifyKind(announcement.EndDate.Value, DateTimeKind.Utc);

        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync();

        return Ok(announcement);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Announcement updated)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null)
            return NotFound();

        announcement.Message = updated.Message;
        announcement.Type = updated.Type;
         if (updated.StartDate.HasValue)
        announcement.StartDate = DateTime.SpecifyKind(updated.StartDate.Value, DateTimeKind.Utc);

        if (updated.EndDate.HasValue)
        announcement.EndDate = DateTime.SpecifyKind(updated.EndDate.Value, DateTimeKind.Utc);


        await _context.SaveChangesAsync();
        return Ok(announcement);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null)
            return NotFound();

        _context.Announcements.Remove(announcement);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
