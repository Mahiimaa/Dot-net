using System;
using Microsoft.EntityFrameworkCore;
using Backend.Model;

namespace Backend.Data;

public class AuthDbContext : DbContext
{
    public AuthDbContext (DbContextOptions <AuthDbContext> options) : base(options)
    {

    }
    public DbSet<User> Users { get; set;}
    public DbSet<Book> Books { get; set; }

    public DbSet<Discount> Discounts { get; set; }

    public DbSet<Announcement> Announcements { get; set; }

    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // modelBuilder.Entity<User>()
        //     .HasIndex(u => u.Username)
        //     .IsUnique();
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        modelBuilder.Entity<User>()
            .HasIndex(u => u.MembershipId)
            .IsUnique();
        modelBuilder.Entity<Book>()
                .HasIndex(b => b.ISBN)
                .IsUnique();
        modelBuilder.Entity<Discount>()
            .HasMany(d => d.Books)
            .WithMany(b => b.Discounts);                
        modelBuilder.Entity<Announcement>().Property(a => a.Type).HasMaxLength(50);

    }
}
