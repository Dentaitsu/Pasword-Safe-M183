---
description: Teil-Audit – Libraries und Abhängigkeiten
---

Führe ein Teil-Security-Review gemäss Skill `nextjs-security-review` durch.
Prüfe NUR Abschnitt "3. Libraries & Abhängigkeiten".

Diese App hat zwei Package-Manifeste:
- Frontend: `frontend/package.json` / `frontend/package-lock.json` (npm, Vite/React)
- Backend: `backend/backend.csproj` (NuGet, ASP.NET Core)

1. Lies zuerst `security-findings.md` (falls vorhanden).
2. Führe `npm audit --audit-level=high` im Verzeichnis `frontend/` aus.
3. Prüfe zusätzlich: Lockfile eingecheckt, veraltete kritische Pakete (react, vite, eslint),
   verdächtige Pakete, postinstall-Scripts.
4. Prüfe `backend/backend.csproj` auf veraltete NuGet-Pakete mit bekannten CVEs
   (insbesondere BCrypt.Net-Next, Microsoft.AspNetCore.Authentication.JwtBearer,
   Npgsql.EntityFrameworkCore.PostgreSQL, MediatR).
5. Report im Skill-Format ausgeben und an `security-findings.md` anhängen.
6. Keine Updates einspielen – frage am Ende, welche Pakete aktualisiert werden sollen.
