namespace Backend.Model
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string CustomerName { get; set; } = string.Empty;
        public string BookName { get; set; } = string.Empty;
        public string ClaimCode { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? PickupDate { get; set; }
        public string? Note { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new();

    }
}