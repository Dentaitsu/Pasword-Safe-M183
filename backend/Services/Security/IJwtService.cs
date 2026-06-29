using backend.Models;

namespace backend.Services.Security;

public interface IJwtService
{
    string GenerateToken(User user);
}
