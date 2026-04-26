var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4300")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


builder.Services.AddControllers();

var app = builder.Build();


app.UseCors("AllowAngular");

app.UseHttpsRedirection();

app.UseAuthorization();


app.MapControllers();

app.Run();
