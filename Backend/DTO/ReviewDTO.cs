using System.ComponentModel.DataAnnotations;
namespace Backend.DTO;
public class ReviewDTO
{
    [Required]
    public int BookId { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    public string Comment { get; set; } = string.Empty;
}