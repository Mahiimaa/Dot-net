public class DiscountDTO {
    public string Title { get; set; } = "" ;
    public decimal DiscountPercent { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool OnSale { get; set; }

    public List<int> BookIds { get; set; } = new(); 
}
