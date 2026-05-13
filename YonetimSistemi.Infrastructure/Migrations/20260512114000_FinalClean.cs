using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YonetimSistemi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FinalClean : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Customers",
                keyColumn: "Id",
                keyValue: 999,
                column: "PasswordHash",
                value: "$2a$11$5pjzsjzNneM.3EmGuKb9VesPZaEDXiFqbXXhBbTR18Eenj5O/ppii");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Customers",
                keyColumn: "Id",
                keyValue: 999,
                column: "PasswordHash",
                value: "$2a$11$9L8dMKIGEKTHFSEImpF9yOeJNiWs7JxpJbpKFpDI6YPFzqIE0Mvua");
        }
    }
}
