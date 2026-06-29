using backend.Data;
using backend.Services.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Passwords;

public record UpdatePasswordCommand(Guid UserId, Guid EntryId, PasswordEntryInput Input) : IRequest<PasswordEntryDto?>;

public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, PasswordEntryDto?>
{
    private readonly AppDbContext _db;
    private readonly IEncryptionService _encryption;

    public UpdatePasswordCommandHandler(AppDbContext db, IEncryptionService encryption)
    {
        _db = db;
        _encryption = encryption;
    }

    public async Task<PasswordEntryDto?> Handle(UpdatePasswordCommand request, CancellationToken ct)
    {
        var entry = await _db.PasswordEntries
            .FirstOrDefaultAsync(p => p.Id == request.EntryId && p.UserId == request.UserId, ct);

        if (entry is null) return null;

        var input = request.Input;
        entry.Website = input.Website;
        entry.Name = input.Name;
        entry.Email = input.Email;
        entry.Username = input.Username;
        entry.EncryptedPassword = _encryption.Encrypt(input.Password);
        entry.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return new PasswordEntryDto(entry.Id, entry.Website, entry.Name, entry.Email, entry.Username, input.Password);
    }
}
