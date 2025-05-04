using Microsoft.AspNetCore.SignalR;

public class OrderHub : Hub
{
    public async Task BroadcastOrder(string message)
    {
        await Clients.All.SendAsync("orderBroadcast", message);
    }
}