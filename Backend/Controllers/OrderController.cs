using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Model;
using Backend.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;


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

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDTO dto)
        {
            var order = new Order
            {
                CustomerName = dto.CustomerName,
                BookName = dto.BookName,
                ClaimCode = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                TotalAmount = dto.TotalAmount,
                Status = "Pending",
                OrderDate = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Broadcast order
            var hubContext = HttpContext.RequestServices.GetService<IHubContext<OrderHub>>();
            await hubContext.Clients.All.SendAsync("orderBroadcast", $"New order placed for {order.BookName}!");

            return Ok(order);
        }

        public class OrderDTO
        {
            public string CustomerName { get; set; }
            public string BookName { get; set; }
            public decimal TotalAmount { get; set; }
        }
    }
}
