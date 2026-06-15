### Architekturentscheidung
Unsere Anwendung basiert auf einer klassischen Client-Server-Architektur mit einer klaren Trennung zwischen Frontend und Backend.

Das Frontend wurde mit React umgesetzt und übernimmt die Benutzeroberfläche. Das Backend wurde mit ASP.NET Core und stellt eine REST-API zur Verfügung.

Das Backend ist zusätzlich intern in eine 3-Schichten-Architektur unterteilt:
- Controller (API)
- Service (Business Logik)
- Repository (Datenzugriff)

Für die Datenbank wurde mit PostgreSQL umgesetzt.

### Security
#### Authentifizierung
Ein User soll mit JWT in einem HttpOnly Cookie authentifiziert werden.

#### Connection
Kommunikation zwischen Frontend und Backend laufen mittels HTTPS ab damit dei daten auf dem Weg encrypted sind.