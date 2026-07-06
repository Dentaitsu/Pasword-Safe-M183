---
description: Teil-Audit – Service-Schicht / API-Aufrufe ans C#-Backend
argument-hint: [optional: Pfad, z. B. "frontend/src/api" oder "backend/Services"]
---

Führe ein Teil-Security-Review gemäss Skill `nextjs-security-review` durch.
Prüfe NUR Abschnitt "2. Service-Schicht – C#-Backend" (Injections, SSRF,
API-Key-Handling, Validierung, Fehlerbehandlung).

Scope: $ARGUMENTS (wenn leer: Service-/API-Client-Dateien selbst identifizieren
und mir die Liste zur Bestätigung zeigen, bevor du prüfst).

Relevante Dateien dieser App:
- Frontend API-Client: `frontend/src/api/client.ts`, `frontend/src/api/auth.ts`, `frontend/src/api/passwords.ts`
- Backend-Controller: `backend/Controllers/AuthController.cs`, `backend/Controllers/PasswordsController.cs`
- Backend-Services: `backend/Services/Auth/`, `backend/Services/Passwords/`, `backend/Services/Security/`
- Konfiguration: `backend/Program.cs`, `backend/appsettings*.json`

1. Lies zuerst `security-findings.md` (falls vorhanden), um Doppelprüfungen zu vermeiden.
2. Arbeite die Checkliste für den Scope ab.
3. Report im Skill-Format ausgeben und an `security-findings.md` anhängen.
4. Keine Codeänderungen – frage am Ende, welche Befunde behoben werden sollen.
