using backend.Data;
using backend.Models;
using MediatR;

namespace backend.Test;

public record CreateTestEntryCommand(string Message) : IRequest<TestEntry>;

public class CreateTestEntryHandler : IRequestHandler<CreateTestEntryCommand, TestEntry>
{
    private readonly AppDbContext _db;
    public CreateTestEntryHandler(AppDbContext db) => _db = db;

    public async Task<TestEntry> Handle(CreateTestEntryCommand request, CancellationToken ct)
    {
        var entry = new TestEntry { Message = request.Message };
        _db.TestEntries.Add(entry);
        await _db.SaveChangesAsync(ct);
        return entry;
    }
}