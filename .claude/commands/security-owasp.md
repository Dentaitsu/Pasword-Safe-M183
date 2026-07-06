---
description: Teil-Audit – OWASP Top 10 (2025)
argument-hint: [optional: Pfad, z. B. "frontend/src" oder "backend/Controllers"]
---

Führe ein Teil-Security-Review gemäss Skill `nextjs-security-review` durch.
Prüfe NUR Abschnitt "1. OWASP Top 10 (2025)".

Scope: $ARGUMENTS (wenn leer: sinnvolle Teilbereiche vorschlagen und mich wählen lassen,
statt alles auf einmal zu prüfen).

1. Lies zuerst `security-findings.md` (falls vorhanden), um Doppelprüfungen zu vermeiden.
2. Arbeite die OWASP-Checkliste für den Scope ab.
   Relevante Pfade dieser App:
   - Frontend: `frontend/src/` (React/Vite, kein SSR)
   - API-Client: `frontend/src/api/`
   - Backend-Controller: `backend/Controllers/`
   - Backend-Services: `backend/Services/`
   - Konfiguration: `backend/appsettings*.json`, `backend/Program.cs`
3. Report im Skill-Format ausgeben und an `security-findings.md` anhängen.
4. Keine Codeänderungen – frage am Ende, welche Befunde behoben werden sollen.
