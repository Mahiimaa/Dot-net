using System.ComponentModel.DataAnnotations;
namespace Backend.Model
{
    public class Book
    {
         [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Tags { get; set; } = string.Empty;

        [Required]
        public string Author { get; set; } = string.Empty;

        public string Genre { get; set; } = string.Empty;

        public string Language { get; set; } = string.Empty;

        public string ISBN { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Format { get; set; } = string.Empty;

        [Range(0, 99999)]
        public decimal Price { get; set; }

        public string Publisher { get; set; } = string.Empty;

        public string Availability { get; set; } = "Available";

        public string ImageUrl { get; set; } = string.Empty;

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int InStockQty { get; set; } = 0;
        public int ReservedQty { get; set; } = 0;

        public decimal? DiscountPercent { get; set; }
        public DateTime? DiscountStart { get; set; }
        public DateTime? DiscountEnd { get; set; }
        public bool IsOnSale { get; set; } = false;

        public bool IsBestseller { get; set; } = false;
        public bool IsAwardWinner { get; set; } = false;
        public bool IsComingSoon { get; set; } = false;
        public DateTime? PublishDate { get; set; }
        public List<Discount> Discounts { get; set; } = new();

    }
}
