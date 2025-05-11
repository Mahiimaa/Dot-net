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
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Cart> Carts { get; set; }

    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<BroadcastMessage> BroadcastMessages { get; set; }

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

        modelBuilder.Entity<Wishlist>()
        .HasIndex(w => new { w.UserId, w.BookId })
        .IsUnique();

        modelBuilder.Entity<Cart>()
            .HasIndex(c => new { c.UserId, c.BookId })
            .IsUnique();
        // modelBuilder.Entity<Bookmark>()
        //     .HasIndex(b => new { b.UserId, b.BookId })
        //     .IsUnique();
        modelBuilder.Entity<Review>()
            .HasIndex(r => new { r.UserId, r.BookId })
            .IsUnique();

        modelBuilder.Entity<Order>()
        .HasMany(o => o.OrderItems)
        .WithOne(oi => oi.Order)
        .HasForeignKey(oi => oi.OrderId);


        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Book)
            .WithMany()
            .HasForeignKey(oi => oi.BookId);
    }
}
