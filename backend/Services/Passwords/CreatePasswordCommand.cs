using backend.Data;
using backend.Models;
using backend.Services.Security;
using MediatR;

namespace backend.Services.Passwords;

public record CreatePasswordCommand(Guid UserId, PasswordEntryInput Input) : IRequest<PasswordEntryDto>;

public class CreatePasswordCommandHandler : IRequestHandler<CreatePasswordCommand, PasswordEntryDto>
{
    private readonly AppDbContext _db;
    private readonly IEncryptionService _encryption;

    public CreatePasswordCommandHandler(AppDbContext db, IEncryptionService encryption)
    {
        _db = db;
        _encryption = encryption;
    }

    public async Task<PasswordEntryDto> Handle(CreatePasswordCommand request, CancellationToken ct)
    {
        var input = request.Input;
        var entry = new PasswordEntry
        {
            UserId = request.UserId,
            Website = input.Website,
            Name = input.Name,
            Email = input.Email,
            Username = input.Username,
            EncryptedPassword = _encryption.Encrypt(input.Password),
        };

        _db.PasswordEntries.Add(entry);
        await _db.SaveChangesAsync(ct);

        return new PasswordEntryDto(entry.Id, entry.Website, entry.Name, entry.Email, entry.Username, input.Password);
    }
}
