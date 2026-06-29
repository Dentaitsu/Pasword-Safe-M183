using Microsoft.Extensions.Configuration;

namespace backend.Services.Security;

public class BCryptPasswordHasher : IPasswordHasher
{
    private readonly string _pepper;

    public BCryptPasswordHasher(IConfiguration config)
    {
        _pepper = config["PEPPER"] ?? throw new InvalidOperationException("PEPPER is not configured");
    }

    public string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(Peppered(password), workFactor: 12);

    public bool Verify(string password, string hash)
        => BCrypt.Net.BCrypt.Verify(Peppered(password), hash);

    private string Peppered(string password) => password + _pepper;
}
