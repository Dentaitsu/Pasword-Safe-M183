### Architekturentscheidung
Unsere Anwendung basiert auf einer klassischen Client-Server-Architektur mit einer klaren Trennung zwischen Frontend und Backend.

Das Frontend wurde mit React umgesetzt und übernimmt die Benutzeroberfläche. Das Backend wurde mit Spring Boot implementiert und stellt eine REST-API zur Verfügung.

Das Backend ist zusätzlich intern in eine 3-Schichten-Architektur unterteilt:
- Controller (API)
- Service (Business Logik)
- Repository (Datenzugriff)

Für die Datenbank wurde mit PostgreSQL umgesetzt.

### Dependencies
#### Spring Data JPA
Die Spring Data JPA wird Datenbank Abfragen um einiges erleichtern, ähnlich wie EF Core in der .NET Welt.

#### Spring Web
Spring Web erlaubt uns im Backend eine REST API, die Daten an das Frontend gibt, zu erstellen.

#### Lombok
Lombok hilft dabei "Boilerplate-Code" zu reduzieren.