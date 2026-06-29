using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Passwords;

public record DeletePasswordCommand(Guid UserId, Guid EntryId) : IRequest<bool>;

public class DeletePasswordCommandHandler : IRequestHandler<DeletePasswordCommand, bool>
{
    private readonly AppDbContext _db;

    public DeletePasswordCommandHandler(AppDbContext db) => _db = db;

    public async Task<bool> Handle(DeletePasswordCommand request, CancellationToken ct)
    {
        var entry = await _db.PasswordEntries
            .FirstOrDefaultAsync(p => p.Id == request.EntryId && p.UserId == request.UserId, ct);

        if (entry is null) return false;

        _db.PasswordEntries.Remove(entry);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
