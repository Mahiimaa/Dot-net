using System.ComponentModel.DataAnnotations;

namespace Backend.Model
{
    public class Announcement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = "Info"; 

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
