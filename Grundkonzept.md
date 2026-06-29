### Architekturentscheidung
Unsere Anwendung basiert auf einer klassischen Client-Server-Architektur mit einer klaren Trennung zwischen Frontend und Backend.

Das Frontend wurde mit React umgesetzt und übernimmt die Benutzeroberfläche. Das Backend wurde mit ASP.NET Core und stellt eine REST-API zur Verfügung.

Das Backend ist zusätzlich intern in eine 3-Schichten-Architektur unterteilt:
- Controller (API)
- Service (Business Logik)
- Data (DbContext für Datenbank Zugriff)

Für die Datenbank wurde mit PostgreSQL umgesetzt.

### Security
#### Authentifizierung
Ein Benutzer soll mit JWT in einem HttpOnly Cookie authentifiziert werden.

#### Accounts/Benutzer
Benutzer haben einen eindeutigen Benutzernamen und ein Passwort. Jeder Benutzer kann nur auf seine eigenen Einträge zugreifen.

#### Passwörter
##### Passwort vergessen
Ich habe mich bewusst dafür entschieden, dass Benutzer ihre Passwörter nicht zurücksetzen können. Die Entscheidung habe ich getroffen, da jede möglichkeit das zu tun Angriffspunkte aufmacht, die Potenziell ausgenutzt werden könnten. Meiner Meinung nach liegt bei Tools wie Passwort-Managern hierbei die Verantwortung 100% bei den Benutzern, deren Passwortnicht zu vergessen. Wenn das Passwort vergessen wird, kommt man nicht mehr in den Safe, genau wie es bei einem Physischen Schlüsselsystem wäre.

Die Benutzer werden selbstverständlich beim erstellen des Accounts darauf hingewiesen, das sie ihr Passwort nicht von aussen zurücksetzen können. Das Master Passwort kann, wenn man eingelogt ist angepasst werden.

##### Hashing
Das Master Passwort wird gehasht in der Datenbank abgespeichert. Dazu werden wir einen Algorithmus wie Argon2 oder bcrypt verwenden. Zu dem Passwort wird dazu noch ein Salt und Pepper hinzugefügt um Rainbow Table angriffe zu verhindern.

##### Encryption
Die gespeicherten Einträge werden Verschlüsselt in der Datenbank abgelegt. Dafür verwenden wir AES-256. Der Verschlüsselungs Schlüssel wird im Backend verwaltet, und niemals in die Datenbank gespeichert.

#### Login
Beim logging soll bei allen login requests ein zufälliger sleep von ein paar ms hinzugefügt werden, um weiter zu verschleiern ob ein login erfolgreich war oder nicht. Es soll auch einen Lockout geben, nach zu vielen fehlgeschlagenen Login versuchen.

#### Connection
Kommunikation zwischen Frontend und Backend laufen mittels HTTPS ab damit dei daten auf dem Weg encrypted sind.

#### Logging/Monitoring
Sicherheitsrelevante Ereignisse wie fehlgeschlagene Login versuche werden festgehalten. In einer produktiven Umgebung könnten die Logs an ein zentrales Monitoring-System weitergeleitet werden.

### UI
#### Use Cases
- Login/Logout
- Einträge erstellen, lesen, beabeiten und löschen (CRUD)
- Gespeicherte Passwörter anzeigen/kopieren

#### Passwörter kopieren
Passwörter sollten nur für eine kurze Zeit (z.B. 10 Sekunden) im Clipboard gespeichert bleiben, damit sie nicht über diese Weise abhanden kommen.