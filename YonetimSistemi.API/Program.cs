using Microsoft.EntityFrameworkCore;
using YonetimSistemi.Application.UseCases.Customers;
using YonetimSistemi.Application.UseCases.Loans;
using YonetimSistemi.Application.UseCases.Installments;
using YonetimSistemi.Application.UseCases.Payments;
using YonetimSistemi.Application.Interfaces;
using YonetimSistemi.Infrastructure.Data;
using YonetimSistemi.Infrastructure.Repositories;
using YonetimSistemi.Infrastructure.Services;
using YonetimSistemi.Application.UseCases.Auth;



var builder = WebApplication.CreateBuilder(args);

// -------------------------------------------------------
// 1. VERİTABANI BAĞLANTISI
// appsettings.json'daki "DefaultConnection" string'ini kullan
// -------------------------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// -------------------------------------------------------
// 2. REPOSITORY'LER (Dependency Injection kaydı)
// Interface → Implementation eşleşmesi burada yapılır
// Her istek için yeni bir instance oluşturulur (Scoped)
// -------------------------------------------------------
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<IInstallmentRepository, InstallmentRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

// -------------------------------------------------------
// 3. MOCK SERVİSLER
// -------------------------------------------------------
builder.Services.AddScoped<IMockCreditScoreService, MockCreditScoreService>();
builder.Services.AddScoped<IMockPaymentService, MockPaymentService>();

// -------------------------------------------------------
// 4. USE CASE'LER
// Her UseCase ayrı ayrı kaydedilir
// -------------------------------------------------------

// Customer UseCase'leri

// Auth
builder.Services.AddScoped<LoginUseCase>();

builder.Services.AddScoped<CreateCustomerUseCase>();
builder.Services.AddScoped<GetCustomerUseCase>();
builder.Services.AddScoped<GetAllCustomersUseCase>();
builder.Services.AddScoped<UpdateCustomerUseCase>();
builder.Services.AddScoped<DeleteCustomerUseCase>();
builder.Services.AddScoped<GetDebtSummaryUseCase>();

// Loan UseCase'leri
builder.Services.AddScoped<GetLoanUseCase>();
builder.Services.AddScoped<GetLoansByCustomerUseCase>();
builder.Services.AddScoped<UpdateLoanStatusUseCase>();
builder.Services.AddScoped<ApplyLoanUseCase>();
builder.Services.AddScoped<ApproveLoanUseCase>();
builder.Services.AddScoped<RejectLoanUseCase>();
builder.Services.AddScoped<GetPendingLoansUseCase>();

// Installment UseCase'leri
builder.Services.AddScoped<GetInstallmentsByLoanUseCase>();
builder.Services.AddScoped<UpdateOverdueInstallmentsUseCase>();

// Payment UseCase'leri
builder.Services.AddScoped<CreatePaymentUseCase>();
builder.Services.AddScoped<GetPaymentUseCase>();

// -------------------------------------------------------
// 5. CONTROLLER'LAR VE SWAGGER
// -------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -------------------------------------------------------
// 6. CORS (React frontend'in API'ye erişebilmesi için)
// -------------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174"  // Vite'ın kullandığı port
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// -------------------------------------------------------
// 7. MİGRASYON OTOMATİK UYGULAMA (uygulama açılınca)
// Veritabanı yoksa oluşturur, migration varsa uygular
// -------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// -------------------------------------------------------
// 8. MIDDLEWARE PIPELINE
// -------------------------------------------------------
if (app.Environment.IsDevelopment())
{
    // Geliştirme ortamında Swagger arayüzü açık olsun
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS middleware'i UseRouting'den önce gelmeli
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();

