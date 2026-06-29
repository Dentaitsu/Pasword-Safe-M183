using backend.Data;
using backend.Services.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services.Auth;

public record LoginCommand(string Username, string Password) : IRequest<LoginResult>;

public record LoginResult(bool Success, string? Token, string? Error);

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(5);

    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtService _jwt;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(AppDbContext db, IPasswordHasher hasher, IJwtService jwt, ILogger<LoginCommandHandler> logger)
    {
        _db = db;
        _hasher = hasher;
        _jwt = jwt;
        _logger = logger;
    }

    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken ct)
    {
        // Random delay obscures whether the username exists, password was wrong, or login succeeded.
        await Task.Delay(Random.Shared.Next(150, 400), ct);

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username, ct);

        if (user is not null && user.LockoutUntil is { } until && until > DateTime.UtcNow)
        {
            _logger.LogWarning("Login attempt for locked-out user {Username}", request.Username);
            return new LoginResult(false, null, "Account is temporarily locked. Try again later.");
        }

        if (user is null || !_hasher.Verify(request.Password, user.PasswordHash))
        {
            if (user is not null)
            {
                user.FailedLoginAttempts++;
                if (user.FailedLoginAttempts >= MaxFailedAttempts)
                {
                    user.LockoutUntil = DateTime.UtcNow.Add(LockoutDuration);
                    _logger.LogWarning("User {Username} locked out after {Attempts} failed attempts", request.Username, user.FailedLoginAttempts);
                }
                await _db.SaveChangesAsync(ct);
            }

            _logger.LogWarning("Failed login attempt for {Username}", request.Username);
            return new LoginResult(false, null, "Invalid username or password.");
        }

        user.FailedLoginAttempts = 0;
        user.LockoutUntil = null;
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("User {Username} logged in successfully", request.Username);
        return new LoginResult(true, _jwt.GenerateToken(user), null);
    }
}
