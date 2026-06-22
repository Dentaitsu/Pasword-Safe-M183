using backend.Models;

namespace backend.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AppDbContext db)
    {
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var entries = new List<TestEntry>
        {
            new() { Message = "Test Entry 1" },
            new() { Message = "Test Entry 2" },
            new() { Message = "Test Entry 3" },
        };

        db.TestEntries.AddRange(entries);
        await db.SaveChangesAsync();
    }
}