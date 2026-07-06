# Security-Findings – Password Safe App

## Anpassungen

*Pflichtabschnitt gemäss Aufgabe 1.3 – dokumentiert alle Anpassungen der generischen Commands/Skill an diese App.*

### Stack-Identifikation

Die App ist **kein Next.js-Projekt**. Tatsächlicher Stack:

| Schicht | Technologie |
|---|---|
| Frontend | React 19 + Vite 8 (CSR, kein SSR, kein App-Router) |
| Backend | ASP.NET Core (.NET 8) mit MediatR und EF Core |
| Datenbank | PostgreSQL |
| Auth | JWT (HMAC-SHA256) in httpOnly-Cookie |

### Anpassung 1: Skill-Abschnitt 2 – Auth-Methode und Backend

**Original:** Generisch für Next.js mit C#-Backend formuliert (API-Key-Handling, NEXT_PUBLIC_*-Checks, Server Actions).

**Angepasst:**
- Auth-Methode: JWT-Cookie (nicht API-Key). Prüfpunkte für Cookie-Flags (httpOnly, Secure, SameSite) ergänzt.
- NEXT_PUBLIC_*-Checks entfernt – nicht relevant (kein Next.js). Ersetzt durch VITE_*-Env-Var-Prüfung.
- Server Actions / Middleware-Abschnitt entfernt – kein Next.js-Konzept vorhanden.
- Backend: ASP.NET Core statt generischem "C#-Backend". Konkrete Dateipfade und Klassen benannt.
- SSRF-Abschnitt als "nicht relevant" markiert (Backend macht keine externen HTTP-Calls).

**Begründung:** Die generischen Next.js-Prüfpunkte passen nicht auf eine reine CSR-SPA mit separatem ASP.NET-Backend. Falsche Prüfpunkte würden False Positives oder Lücken erzeugen.

### Anpassung 2: Skill-Abschnitt 4 – Framework-spezifische Prüfungen

**Original:** Next.js-spezifisch (Server/Client-Boundary, Server Actions, Middleware, Caching, Redirects).

**Angepasst:**
- Server/Client-Boundary: vereinfacht auf "Secrets nur im Backend, nie in VITE_*-Vars".
- Caching-Abschnitt entfernt (kein Next.js-Caching).
- Redirects-Abschnitt entfernt (keine serverseitige Redirect-Logik).
- Uploads-Abschnitt entfernt (keine File-Upload-Funktionalität).
- Neu: ASP.NET Core-spezifische Checks (Security-Header-Middleware, CORS-Konfiguration, AllowedHosts, DbInitializer).

**Begründung:** Next.js-spezifische Angriffsvektoren (CVE-2025-29927, Cache-Poisoning) existieren in dieser App nicht.

### Anpassung 3: Zwei neue Password-Safe-spezifische Prüfpunkte (Aufgabe 1.3.3)

**Neu in Skill Abschnitt 4 ergänzt:**

1. **Verschlüsselung der gespeicherten Accounts:** Prüft ob AES-256-GCM korrekt angewendet wird (zufälliger Nonce, Tag-Validierung), ob ENCRYPTION_KEY ausreichend stark ist, und ob es einen Key-Rotation-Mechanismus gibt.

2. **Master-Passwort / Encryption-Key-Handling:** Prüft ob der ENCRYPTION_KEY ein einzelner server-seitiger Schlüssel für alle User ist (kein user-individueller Schlüssel abgeleitet aus dem Benutzer-Passwort via PBKDF2/Argon2). Analysiert das Risiko bei Key-Kompromittierung und fehlender Key-Isolation zwischen Benutzern.

**Begründung:** Diese Punkte sind Password-Manager-spezifische Risiken, die in generischen OWASP-Checks nicht erfasst werden. Ein Key-Kompromiss kompromittiert in diesem Design alle gespeicherten Passwörter aller Benutzer.

### Anpassung 4: Pfade in Command-Dateien

Alle fünf Command-Dateien enthalten nun konkrete Pfad-Angaben dieser App:
- `frontend/src/api/` statt generisch `src/services`
- `backend/Controllers/`, `backend/Services/Security/` statt generischer Pfad
- `frontend/package.json` + `backend/backend.csproj` statt nur `package.json`

---

## Audit-Protokoll

*(Befunde werden von den Commands hier angehängt)*
