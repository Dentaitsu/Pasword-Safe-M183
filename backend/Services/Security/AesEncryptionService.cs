using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;

namespace backend.Services.Security;

// AES-256-GCM authenticated encryption. Output layout: nonce (12 bytes) || ciphertext || tag (16 bytes), base64-encoded.
public class AesEncryptionService : IEncryptionService
{
    private const int NonceSize = 12;
    private const int TagSize = 16;

    private readonly byte[] _key;

    public AesEncryptionService(IConfiguration config)
    {
        var encoded = config["ENCRYPTION_KEY"] ?? throw new InvalidOperationException("ENCRYPTION_KEY is not configured");
        _key = Convert.FromBase64String(encoded);
        if (_key.Length != 32)
            throw new InvalidOperationException("ENCRYPTION_KEY must decode to 32 bytes for AES-256");
    }

    public string Encrypt(string plaintext)
    {
        var nonce = RandomNumberGenerator.GetBytes(NonceSize);
        var plaintextBytes = System.Text.Encoding.UTF8.GetBytes(plaintext);
        var ciphertext = new byte[plaintextBytes.Length];
        var tag = new byte[TagSize];

        using var aesGcm = new AesGcm(_key, TagSize);
        aesGcm.Encrypt(nonce, plaintextBytes, ciphertext, tag);

        var result = new byte[NonceSize + ciphertext.Length + TagSize];
        Buffer.BlockCopy(nonce, 0, result, 0, NonceSize);
        Buffer.BlockCopy(ciphertext, 0, result, NonceSize, ciphertext.Length);
        Buffer.BlockCopy(tag, 0, result, NonceSize + ciphertext.Length, TagSize);

        return Convert.ToBase64String(result);
    }

    public string Decrypt(string encoded)
    {
        var data = Convert.FromBase64String(encoded);
        var nonce = data[..NonceSize];
        var tag = data[^TagSize..];
        var ciphertext = data[NonceSize..^TagSize];
        var plaintextBytes = new byte[ciphertext.Length];

        using var aesGcm = new AesGcm(_key, TagSize);
        aesGcm.Decrypt(nonce, ciphertext, tag, plaintextBytes);

        return System.Text.Encoding.UTF8.GetString(plaintextBytes);
    }
}
