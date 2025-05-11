namespace Backend.Model
{
    public class BroadcastMessage
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; } 
    }
}