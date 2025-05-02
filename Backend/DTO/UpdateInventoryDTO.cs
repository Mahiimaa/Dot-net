using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
        public class UpdateInventoryDTO
    {
        public int InStockQty { get; set; }
        public int ReservedQty { get; set; }
    }
}
