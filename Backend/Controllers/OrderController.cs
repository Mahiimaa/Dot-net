using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Model;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public OrdersController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/pickup")]
        public async Task<IActionResult> MarkAsReadyForPickup(int id, [FromBody] OrderPickupDTO dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = "ReadyForPickup";
            order.PickupDate = dto.PickupDate;
            order.Note = dto.Note;

            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
