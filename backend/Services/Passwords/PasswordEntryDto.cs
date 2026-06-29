namespace backend.Services.Passwords;

public record PasswordEntryDto(Guid Id, string Website, string Name, string Email, string Username, string Password);

public record PasswordEntryInput(string Website, string Name, string Email, string Username, string Password);
