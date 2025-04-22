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
    }
}
