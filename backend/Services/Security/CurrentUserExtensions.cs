using System.Security.Claims;

namespace backend.Services.Security;

public static class CurrentUserExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
        => Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
