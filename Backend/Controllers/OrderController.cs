using Backend.Data;
using Backend.Model;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly IHubContext<OrderHub> _hubContext;
        private readonly EmailService _emailService;

        public OrderController(
            AuthDbContext context,
            IHubContext<OrderHub> hubContext,
            EmailService emailService)
        {
            _context = context;
            _hubContext = hubContext;
            _emailService = emailService;
        }

        // Get all orders (staff or admin only)
        [Authorize(Roles = "Staff,Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.TotalAmount,
                        o.ClaimCode,
                        UserName = $"{o.User.FirstName} {o.User.LastName}",
                        UserId = o.User.Id,
                        Books = o.OrderItems.Select(oi => new
                        {
                            oi.BookId,
                            oi.Quantity,
                            oi.Price,
                            Book = oi.Book != null ? new
                            {
                                oi.Book.Title,
                                oi.Book.ImageUrl,
                                oi.Book.Author
                            } : null
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all orders: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to fetch orders", details = ex.Message });
            }
        }

        // Place an order
        [Authorize(Policy = "UserPolicy")]
        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDTO orderDTO)
        {
            try
            {
                var user = await _context.Users.FindAsync(orderDTO.UserId);
                if (user == null) return NotFound(new { error = "User not found" });

                // Fetch cart items
                var cartItems = await _context.Carts
                    .Where(c => c.UserId == orderDTO.UserId)
                    .Include(c => c.Book)
                    .ToListAsync();
                if (!cartItems.Any()) return BadRequest(new { error = "Cart is empty" });

                // Calculate discounts
                int totalBooks = cartItems.Sum(c => c.Quantity);
                decimal subtotal = cartItems.Sum(c => c.Quantity * c.Book.Price);
                decimal discount = 0;

                // Apply book-specific discounts if active
                foreach (var item in cartItems)
                {
                    var book = item.Book;
                    if (book.IsOnSale &&
                        (!book.DiscountStart.HasValue || book.DiscountStart.Value <= DateTime.UtcNow) &&
                        (!book.DiscountEnd.HasValue || book.DiscountEnd.Value >= DateTime.UtcNow) &&
                        book.DiscountPercent.HasValue)
                    {
                        decimal itemDiscount = (item.Quantity * book.Price) * (book.DiscountPercent.Value / 100);
                        discount += itemDiscount;
                    }
                }

                // 5% discount for 5+ books
                if (totalBooks >= 5)
                {
                    discount += subtotal * 0.05m;
                }

                // 10% stackable discount after 10 successful orders
                int completedOrders = await _context.Orders
                    .CountAsync(o => o.UserId == orderDTO.UserId && o.Status == "Fulfilled");
                if (completedOrders >= 10 && completedOrders % 10 == 0)
                {
                    discount += subtotal * 0.10m;
                }

                decimal total = subtotal - discount;

                // Generate unique claim code
                string claimCode;
                do
                {
                    claimCode = GenerateClaimCode();
                } while (await _context.Orders.AnyAsync(o => o.ClaimCode == claimCode));

                // Create order
                var order = new Order
                {
                    UserId = orderDTO.UserId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Pending",
                    TotalAmount = total,
                    ClaimCode = claimCode,
                    OrderItems = cartItems.Select(c => new OrderItem
                    {
                        BookId = c.BookId,
                        Quantity = c.Quantity,
                        Price = c.Book.Price
                    }).ToList()
                };

                // Update inventory
                foreach (var item in cartItems)
                {
                    var book = item.Book;
                    if (book.InStockQty < item.Quantity)
                    {
                        return BadRequest(new { error = $"Insufficient stock for {book.Title}" });
                    }
                    book.InStockQty -= item.Quantity;
                    book.ReservedQty += item.Quantity;
                }

                // Save order and clear cart
                _context.Orders.Add(order);
                _context.Carts.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                // Send confirmation email
                string bookNames = string.Join(", ", cartItems.Select(c => c.Book.Title));
                await _emailService.SendOrderConfirmationEmailAsync(
                    user.Email,
                    user.FirstName,
                    claimCode,
                    bookNames);

                // Broadcast order
                string broadcastMessage = $"New order placed by {user.FirstName} {user.LastName}: {totalBooks} books!";
                await _hubContext.Clients.All.SendAsync("orderBroadcast", broadcastMessage);

                return Ok(new { message = "Order placed successfully", claimCode });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error placing order: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to place order", details = ex.Message });
            }
        }

        // Cancel an order
        [Authorize(Policy = "UserPolicy")]
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                    .FirstOrDefaultAsync(o => o.Id == id);
                if (order == null) return NotFound(new { error = "Order not found" });
                if (order.Status != "Pending") return BadRequest(new { error = "Only pending orders can be cancelled" });

                // Restore inventory
                foreach (var item in order.OrderItems)
                {
                    item.Book.InStockQty += item.Quantity;
                    item.Book.ReservedQty -= item.Quantity;
                }

                order.Status = "Cancelled";
                await _context.SaveChangesAsync();

                return Ok(new { message = "Order cancelled successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error cancelling order: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to cancel order", details = ex.Message });
            }
        }

        // Delete an order (admin only)
        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);
                if (order == null) return NotFound(new { error = "Order not found" });

                _context.OrderItems.RemoveRange(order.OrderItems);
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting order: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to delete order", details = ex.Message });
            }
        }

        // Get user orders
        [Authorize(Policy = "UserPolicy")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.TotalAmount,
                        o.ClaimCode,
                        OrderItems = o.OrderItems.Select(oi => new
                        {
                            oi.BookId,
                            oi.Quantity,
                            oi.Price,
                            Book = oi.Book != null ? new
                            {
                                oi.Book.Title,
                                oi.Book.ImageUrl,
                                oi.Book.Author
                            } : null
                        })
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching orders: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to fetch orders", details = ex.Message });
            }
        }

        // Fulfill an order (staff or admin only)
        [Authorize(Roles = "Staff,Admin")]
        [HttpPost("fulfill")]
        public async Task<IActionResult> FulfillOrder([FromBody] FulfillOrderDTO fulfillDTO)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.MembershipId == fulfillDTO.MembershipId);
                if (user == null)
                    return NotFound(new { error = "User not found for this Membership ID" });

                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                    .FirstOrDefaultAsync(o => o.ClaimCode == fulfillDTO.ClaimCode && o.UserId == user.Id);
                if (order == null)
                    return NotFound(new { error = "Invalid claim code or membership ID" });
                if (order.Status != "Pending")
                    return BadRequest(new { error = "Order is not pending" });

                foreach (var item in order.OrderItems)
                {
                    item.Book.ReservedQty -= item.Quantity;
                    item.Book.TotalSold += item.Quantity;
                }

                order.Status = "Fulfilled";
                await _context.SaveChangesAsync();

                // Return order details for frontend
                var orderResponse = new
                {
                    order.Id,
                    order.OrderDate,
                    order.Status,
                    order.TotalAmount,
                    order.ClaimCode,
                    OrderItems = order.OrderItems.Select(oi => new
                    {
                        oi.BookId,
                        oi.Quantity,
                        oi.Price,
                        Book = oi.Book != null ? new
                        {
                            oi.Book.Title,
                            oi.Book.ImageUrl,
                            oi.Book.Author
                        } : null
                    })
                };

                return Ok(new { message = "Order fulfilled successfully", order = orderResponse });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fulfilling order: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to fulfill order", details = ex.Message });
            }
        }

        // Generate a 6-character claim code
        private string GenerateClaimCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var code = new StringBuilder(6);
            for (int i = 0; i < 6; i++)
            {
                code.Append(chars[random.Next(chars.Length)]);
            }
            return code.ToString();
        }
    }

    public class PlaceOrderDTO
    {
        public int UserId { get; set; }
    }

    public class FulfillOrderDTO
    {
        public string ClaimCode { get; set; }
        [RegularExpression(@"^[A-F0-9]{8}$", ErrorMessage = "Membership ID must be an 8-character alphanumeric string.")]
        public string MembershipId { get; set; }
    }
}