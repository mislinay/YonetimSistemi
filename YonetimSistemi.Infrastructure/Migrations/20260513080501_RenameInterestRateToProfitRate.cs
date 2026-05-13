using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YonetimSistemi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameInterestRateToProfitRate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InterestRate",
                table: "Loans",
                newName: "ProfitRate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfitRate",
                table: "Loans",
                newName: "InterestRate");
        }


    }
}
