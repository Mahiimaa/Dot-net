using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class fieldsAddedOnBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DiscountEnd",
                table: "Books",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercent",
                table: "Books",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DiscountStart",
                table: "Books",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAwardWinner",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsBestseller",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsComingSoon",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsOnSale",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishDate",
                table: "Books",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountEnd",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DiscountStart",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "IsAwardWinner",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "IsBestseller",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "IsComingSoon",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "IsOnSale",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "PublishDate",
                table: "Books");
        }
    }
}
