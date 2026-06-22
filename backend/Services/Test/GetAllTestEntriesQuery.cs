using backend.Data;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Test;
public record GetAllTestEntriesQuery : IRequest<IEnumerable<TestEntry>>;

public class GetAllTestEntriesQueryHandler : IRequestHandler<GetAllTestEntriesQuery, IEnumerable<TestEntry>>
{
    private readonly AppDbContext _db;
    public GetAllTestEntriesQueryHandler(AppDbContext db) => _db = db;

    public async Task<IEnumerable<TestEntry>> Handle(GetAllTestEntriesQuery request, CancellationToken ct)
        => await _db.TestEntries.ToListAsync(ct);
}