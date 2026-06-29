using backend.Data;
using backend.Services.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Passwords;

public record GetAllPasswordsQuery(Guid UserId) : IRequest<IEnumerable<PasswordEntryDto>>;

public class GetAllPasswordsQueryHandler : IRequestHandler<GetAllPasswordsQuery, IEnumerable<PasswordEntryDto>>
{
    private readonly AppDbContext _db;
    private readonly IEncryptionService _encryption;

    public GetAllPasswordsQueryHandler(AppDbContext db, IEncryptionService encryption)
    {
        _db = db;
        _encryption = encryption;
    }

    public async Task<IEnumerable<PasswordEntryDto>> Handle(GetAllPasswordsQuery request, CancellationToken ct)
    {
        var entries = await _db.PasswordEntries
            .Where(p => p.UserId == request.UserId)
            .ToListAsync(ct);

        return entries.Select(e => new PasswordEntryDto(
            e.Id, e.Website, e.Name, e.Email, e.Username, _encryption.Decrypt(e.EncryptedPassword)));
    }
}
