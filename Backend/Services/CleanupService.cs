using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class CleanupService : BackgroundService
    {
        private readonly IServiceProvider _services;

        public CleanupService(IServiceProvider services)
        {
            _services = services;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _services.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();

                    // Clean up expired BroadcastMessages
                    await context.BroadcastMessages
                        .Where(b => b.ExpiresAt < DateTime.UtcNow)
                        .ExecuteDeleteAsync();

                    // Clean up unverified Users older than 24 hours
                    var cutoff = DateTime.UtcNow.AddHours(-24);
                    var unverifiedUsers = await context.Users
                        .Where(u => !u.IsEmailVerified && u.CreatedAt < cutoff)
                        .ToListAsync();
                    context.Users.RemoveRange(unverifiedUsers);

                    await context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error cleaning up broadcast messages or unverified users: {ex.Message}\n{ex.StackTrace}");
                }
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Run every hour
            }
        }
    }
}