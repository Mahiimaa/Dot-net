// using System.ComponentModel.DataAnnotations;

// namespace Backend.Model
// {
//     public class Bookmark
//     {
//         [Key]
//         public int Id { get; set; }

//         [Required]
//         public int UserId { get; set; }

//         [Required]
//         public int BookId { get; set; }
//         public DateTime BookmarkedAt { get; set; } = DateTime.UtcNow;

//         public User User { get; set; }
//         public Book Book { get; set; }
//     }
// }