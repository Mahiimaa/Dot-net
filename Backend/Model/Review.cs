using System.ComponentModel.DataAnnotations;

namespace Backend.Model
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public int UserId { get; set; }
        public string MemberName { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Book Book { get; set; }
        public User User { get; set; }
    }
}