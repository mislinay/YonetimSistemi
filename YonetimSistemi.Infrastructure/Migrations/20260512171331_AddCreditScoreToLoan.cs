using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YonetimSistemi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCreditScoreToLoan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreditScore",
                table: "Loans",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreditScore",
                table: "Loans");
        }
    }
}
