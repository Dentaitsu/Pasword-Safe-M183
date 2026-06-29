namespace backend.Services.Security;

public interface IEncryptionService
{
    string Encrypt(string plaintext);
    string Decrypt(string encoded);
}
