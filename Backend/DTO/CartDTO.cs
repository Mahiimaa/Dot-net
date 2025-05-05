namespace Backend.DTO
{
    public class CartDTO
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
