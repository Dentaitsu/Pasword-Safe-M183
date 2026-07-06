---
name: nextjs-security-review
description: Führt ein Security-Review der Password-Safe App durch. Stack: Vite + React (CSR, kein SSR) als Frontend, ASP.NET Core (.NET 8) als Backend, PostgreSQL als Datenbank. Auth via JWT in httpOnly-Cookie. Passwörter im Backend mit BCrypt+Pepper gehasht; gespeicherte Einträge mit AES-256-GCM verschlüsselt. Verwenden bei Security-Audits, Reviews von API-Routen, Services oder Dependency-Checks.
---

# Security Review – Password Safe App

## Stack-Übersicht

| Schicht | Technologie | Pfad |
|---|---|---|
| Frontend | React 19 + Vite 8 (CSR, kein SSR) | `frontend/src/` |
| API-Client | Fetch-basiert, keine externe Library | `frontend/src/api/` |
| Backend | ASP.NET Core (.NET 8), MediatR, EF Core | `backend/` |
| Auth | JWT (HMAC-SHA256), Cookie: httpOnly, Secure (non-dev), SameSite=Lax | `backend/Controllers/AuthController.cs`, `backend/Services/Security/JwtService.cs` |
| Passwort-Hashing | BCrypt (work factor 12) + server-side Pepper | `backend/Services/Security/BCryptPasswordHasher.cs` |
| Datenverschlüsselung | AES-256-GCM (nonce||ciphertext||tag, base64) | `backend/Services/Security/AesEncryptionService.cs` |
| Datenbank | PostgreSQL via Npgsql/EF Core | `backend/Data/` |
| Konfiguration | Secrets via Env-Variablen (JWT_SECRET, PEPPER, ENCRYPTION_KEY) | `backend/Program.cs`, `backend/appsettings*.json` |

## Vorgehen

1. Scope bestimmen: ganze App oder nur angegebene Pfade/Dateien.
2. Relevante Dateien identifizieren gemäss Tabelle oben.
3. Checklisten unten systematisch abarbeiten.
4. Befunde im definierten Report-Format ausgeben. Keine Codeänderungen
   ohne Rückfrage – zuerst Report, dann auf Wunsch Fixes.
5. Befunde zusätzlich an `security-findings.md` im Projekt-Root ANHÄNGEN (nie
   überschreiben), mit Header: Datum, geprüfter Bereich, geprüfter Pfad.

## 1. OWASP Top 10 (2025)

Prüfe jede Kategorie gegen den Code:

- **A01 Broken Access Control:** `[Authorize]`-Attribut auf allen Controller-Routen ausser Login/Logout.
  IDOR: Werden Entry-IDs (GUIDs) in `PasswordsController` immer gegen `User.GetUserId()` geprüft?
  Können Einträge anderer User abgerufen, verändert oder gelöscht werden?
- **A02 Security Misconfiguration:** `backend/Program.cs` – fehlende Security-Header
  (CSP, HSTS, X-Frame-Options, X-Content-Type-Options). CORS: nur `http://localhost:5173` erlaubt?
  `AllowedHosts: "*"` in `appsettings.json` prüfen. Debug-/Dev-Flags in Produktion.
- **A03 Software Supply Chain Failures:** siehe Abschnitt 3 (Dependencies).
- **A04 Cryptographic Failures:** AES-256-GCM korrekt implementiert (zufälliger Nonce pro Encrypt,
  Tag-Prüfung)? JWT_SECRET Stärke? PEPPER Stärke? Secrets im Klartext in `appsettings.Development.json`
  (werden diese committed)? HTTPS erzwungen?
- **A05 Injection:** EF Core mit LINQ – kein raw SQL? Falls `FromSqlRaw`/`ExecuteSqlRaw`
  vorhanden, auf Parametrisierung prüfen. XSS im Frontend: React escaped per Default,
  aber `dangerouslySetInnerHTML` oder direkte DOM-Manipulation prüfen.
  Das `website`-Feld wird als Text gerendert – kein `href`, kein XSS-Risiko?
- **A06 Insecure Design:** Rate Limiting auf Login via Lockout (5 Versuche / 5 Min.) vorhanden.
  Andere Endpoints (GET/POST/PUT/DELETE /api/passwords) ohne Rate Limit?
  Fehlende Längen-/Formatvalidierung bei Eingaben?
- **A07 Authentication Failures:** Cookie-Flags (httpOnly ✓, Secure nur non-dev – Problem in Dev!,
  SameSite=Lax). Token-Ablauf 2h. Brute-Force-Schutz vorhanden. Logout löscht Cookie.
  Kein CSRF-Token – durch SameSite=Lax teilweise abgedeckt, aber vollständige Analyse nötig.
- **A08 Software or Data Integrity Failures:** Keine Webhooks. postinstall-Scripts in npm?
  NuGet-Pakete aus vertrauenswürdigen Quellen?
- **A09 Logging & Alerting Failures:** `LoginCommandHandler` loggt fehlgeschlagene/gesperrte Logins.
  Werden Secrets (JWT_SECRET, PEPPER, ENCRYPTION_KEY) je geloggt? Werden Passwort-Klartexte
  in Fehlerbehandlung oder Logs sichtbar?
- **A10 SSRF:** Keine serverseitigen HTTP-Calls an externe URLs im Frontend-API-Client.
  Backend macht keine HTTP-Calls – SSRF nicht relevant.

## 2. Service-Schicht – C#-Backend

Prüfe alle Stellen, an denen Daten verarbeitet oder weitergegeben werden:

- **Input-Validierung:** Werden `PasswordEntryInput`-Felder (Website, Name, Email, Username, Password)
  serverseitig auf Typ, Länge, Format validiert? Kein Zod-Äquivalent – FluentValidation oder
  DataAnnotations vorhanden?
- **IDOR-Schutz:** In `UpdatePasswordCommand` und `DeletePasswordCommand` – wird `UserId`
  als Filter in der DB-Query verwendet, sodass ein User nie den Eintrag eines anderen ändern kann?
- **Secrets-Handling:** JWT_SECRET, PEPPER, ENCRYPTION_KEY nur aus Env/Config, nie hardcodiert.
  In `appsettings.Development.json` liegen Klartext-Secrets – ist diese Datei in `.gitignore`?
- **Fehlerbehandlung:** Werden interne Fehler (Stack Traces, DB-Fehler) an den Client weitergegeben?
  `apiFetch` in `client.ts` gibt `res.text()` bei Fehler zurück – können Backend-Details leaken?
- **Datenbank-Konfiguration:** `Program.cs` hat Fallback-Credentials (User: `admin`, PW: `secret`) –
  diese gelangen bei fehlendem Env-Var in die Verbindung.
- **Verschlüsselung der gespeicherten Passwörter:** Wird in allen CRUD-Operationen
  (Create, Update, Read) korrekt ver-/entschlüsselt? Wird Klartext je persistiert?

## 3. Libraries & Abhängigkeiten

- `npm audit --audit-level=high` im `frontend/`-Verzeichnis ausführen.
- Lockfile (`frontend/package-lock.json`) vorhanden und eingecheckt?
- Kritische Frontend-Pakete auf veraltete Versionen prüfen: `react`, `vite`, `typescript`, `eslint`.
- NuGet-Pakete in `backend/backend.csproj` prüfen:
  - `BCrypt.Net-Next` – bekannte CVEs?
  - `Microsoft.AspNetCore.Authentication.JwtBearer` – Version aktuell?
  - `Npgsql.EntityFrameworkCore.PostgreSQL` – Version aktuell?
  - `MediatR` – Version aktuell?
- Verdächtige Pakete: Typosquatting-Namen, unnötige Pakete mit breiten Berechtigungen.

## 4. Frontend/Backend-spezifisch

**Frontend (Vite + React, CSR):**
- Keine Server/Client-Boundary wie in Next.js – alle Secrets müssen im Backend bleiben.
  Frontend enthält keine API-Keys, keine Secrets – prüfen ob `VITE_*`-Env-Vars
  in `.env`-Dateien sensible Werte enthalten könnten.
- XSS: React escaped per Default. `dangerouslySetInnerHTML` oder `innerHTML`-Zuweisungen suchen.
  Das `website`-Feld wird als Text gerendert, nicht als `href` – kein javascript:-URL-Risiko.
- Clipboard-Handling: Passwort wird nach 10s aus Clipboard gelöscht (`App.tsx`) – korrekt?
- Keine Server Actions / Middleware vorhanden (kein Next.js).

**Backend (ASP.NET Core):**
- Security-Header-Middleware fehlt: `UseHsts()`, `UseXContentTypeOptions()`, CSP-Header prüfen.
- `Secure`-Flag auf Cookie nur in non-dev (`!_env.IsDevelopment()`) – in Dev werden Passwörter
  über ungeschütztes HTTP übertragen.
- `AllowedHosts: "*"` in `appsettings.json` deaktiviert Host-Header-Validation.
- CORS: `AllowAnyHeader()` und `AllowAnyMethod()` mit `AllowCredentials()` –
  ist das Ursprungs-Whitelist ausreichend für Produktion?
- `DbInitializer` läuft nur in Development – enthält er Testdaten mit schwachen Passwörtern?
- Keine explizite Payload-Grössenlimitierung (kein `RequestSizeLimit`-Attribut).

**Password-Safe-spezifische Prüfpunkte:**
- **Verschlüsselung der gespeicherten Accounts:** AES-256-GCM mit zufälligem Nonce pro
  Verschlüsselung (korrekt in `AesEncryptionService`). ENCRYPTION_KEY Stärke (32 Byte = AES-256 ✓).
  Wird der Klartext nach der Verschlüsselung aus dem Speicher bereinigt?
- **Master-Passwort / Encryption-Key-Handling:** Der ENCRYPTION_KEY ist ein einzelner Server-seitiger
  Schlüssel für alle User-Daten. Kein user-individueller Schlüssel aus dem Master-Passwort abgeleitet
  (kein PBKDF2/Argon2 für Encryption). Was passiert bei Key-Kompromittierung – alle Daten entschlüsselbar.
- **Klartextübertragung der Passwörter:** Die API gibt entschlüsselte Passwörter als Klartext an den
  Client zurück (`PasswordEntryDto` enthält `Password` im Klartext). Ist das Transportprotokoll
  (HTTPS) erzwungen?
- **Passwort-Sichtbarkeit im Frontend:** Passwörter sind standardmässig als `••••••••` maskiert,
  können aber per Button sichtbar gemacht werden. Kein Auto-Hide nach Timeout?

## Report-Format

Pro Befund:

| Feld | Inhalt |
|---|---|
| Severity | Critical / High / Medium / Low / Info |
| Kategorie | OWASP-Kategorie oder "Backend-spezifisch" oder "Frontend-spezifisch" |
| Fundstelle | Datei + Zeile(n) |
| Beschreibung | Was ist das Problem, wie ausnutzbar |
| Empfehlung | Konkreter Fix, wenn möglich mit Code-Snippet |

Am Ende: Zusammenfassung (Anzahl Befunde pro Severity) und Frage, welche Befunde
gefixt werden sollen. Keine False-Positive-Flut: im Zweifel als "Info" mit Hinweis
zur manuellen Prüfung markieren.
