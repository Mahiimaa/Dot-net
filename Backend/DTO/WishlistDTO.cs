namespace Backend.DTO
{
    public class WishlistDTO
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
    }
}


// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace Backend.Model
// {
//     public class Wishlist
//     {
//         [Key]
//         public int Id { get; set; }

//         public int BookId { get; set; }
//         public int UserId { get; set; }

//         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

//         // 🟢 Add this navigation property
//         [ForeignKey("BookId")]
//         public Book Book { get; set; }
//     }
// }
