using System.ComponentModel.DataAnnotations;

namespace Backend.Model
{
    public class Discount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Range(0, 100)]
        public decimal DiscountPercent { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public bool OnSale { get; set; } = false;
        public List<Book> Books { get; set; } = new();
    }
}
