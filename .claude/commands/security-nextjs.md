---
description: Teil-Audit – Vite/React-Frontend & ASP.NET Core-spezifische Schwachstellen
argument-hint: [optional: Pfad, z. B. "frontend/src" oder "backend"]
---

Führe ein Teil-Security-Review gemäss Skill `nextjs-security-review` durch.
Prüfe NUR Abschnitt "4. Frontend/Backend-spezifisch".

Hinweis: Diese App verwendet KEIN Next.js. Das Frontend ist Vite + React (CSR, kein SSR).
Das Backend ist ASP.NET Core (.NET 8). Prüfe entsprechend angepasste Punkte:

Scope: $ARGUMENTS (wenn leer: sinnvolle Teilbereiche vorschlagen und mich wählen lassen).

Relevante Pfade:
- Frontend: `frontend/src/App.tsx`, `frontend/src/api/`, `frontend/vite.config.ts`
- Backend: `backend/Program.cs`, `backend/Controllers/`, `backend/Services/Security/`
- Konfiguration: `backend/appsettings*.json`, `docker-compose.yaml`

1. Lies zuerst `security-findings.md` (falls vorhanden), um Doppelprüfungen zu vermeiden.
2. Arbeite die Checkliste für den Scope ab.
3. Report im Skill-Format ausgeben und an `security-findings.md` anhängen.
4. Keine Codeänderungen – frage am Ende, welche Befunde behoben werden sollen.
