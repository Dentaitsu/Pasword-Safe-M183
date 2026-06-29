using backend.Models;
using backend.Services.Security;

namespace backend.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext db, IPasswordHasher hasher)
    {
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var admin = new User
        {
            Username = "admin",
            PasswordHash = hasher.Hash("ChangeMe123!"),
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }
}
