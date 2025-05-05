using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class BookDTO
    {
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

        public IFormFile? Image { get; set; }
        
        public string CreatedBy { get; set; } = string.Empty;

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
        public int? TotalSold { get; set; }
    }
}