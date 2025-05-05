// using System.ComponentModel.DataAnnotations;

// namespace Backend.Model
// {
//     public class Wishlist
//     {
//         [Key]
//         public int Id { get; set; }

//         public int BookId { get; set; }
//         public int UserId { get; set; }

//         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
//     }
// }


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Model
{
    public class Wishlist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public int UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("BookId")]
        public Book? Book { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
