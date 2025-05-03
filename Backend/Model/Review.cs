public class Review {
    public int Id { get; set; }
    public int BookId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public int Rating { get; set; } // 1 to 5
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // public Book Book { get; set; }
}
