using System;

namespace Backend.Model
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string BookName { get; set; } = string.Empty;
        public string ClaimCode { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending"; // or use an enum if preferred
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? PickupDate { get; set; }
        public string? Note { get; set; }
    }
}
