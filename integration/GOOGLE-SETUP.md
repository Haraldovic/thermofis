# Google-Bewertungen auf Thermofis einrichten

Die Website-Vorschau funktioniert vollständig ohne Google-Zugangsdaten. In diesem Zustand erscheinen keine erfundenen Rezensionen, Sterne oder Bewertungszahlen; Besucher können Thermofis über Google suchen. Die Live-Website wird durch diese Dateien nicht geändert.

## Voraussetzungen

- PHP 8 oder neuer, JSON und cURL mit ausgehendem HTTPS.
- Ein bestätigter Thermofis Google Business Profile mit berechtigtem Inhaber/Manager.
- Von Google genehmigter Business-Profile-API-Zugang. Google verlangt u. a. mindestens 60 Tage aktives, verifiziertes Profil und eine im Profil hinterlegte Website. Aktuelle Voraussetzungen: https://developers.google.com/my-business/content/prereqs
- Einmalige OAuth-Zustimmung des berechtigten Inhabers. Keine Passwörter teilen. Der API-Abruf selbst ist kostenfrei; kein kostenpflichtiges Widget wird benötigt. Preisquelle: https://developers.google.com/my-business/content/pricing

## 1. Google-Zugang vorbereiten

1. API-Zugang für das richtige Google-Cloud-Projekt beantragen und die erforderlichen Business Profile APIs aktivieren. Die Review-Methode gehört weiterhin zur Google My Business API v4; Account-/Location-Identifikation erfolgt über die jeweiligen aktuellen Account Management-/Business Information APIs.
2. Einen OAuth-Client vom Typ Webanwendung mit korrekter HTTPS-Callback-URI konfigurieren. Für den Inhaber Scope `https://www.googleapis.com/auth/business.manage` und `access_type=offline` anfordern. Der OAuth-Flow benötigt CSRF-geschützten `state` und einen serverseitigen Code-/Tokenaustausch.
3. `client_id`, `client_secret` und `refresh_token` ausschließlich in der privaten Datei im nächsten Schritt speichern. Kein Token in HTML, JavaScript, ein öffentliches JSON, E-Mail oder öffentlich zugängliche ZIP schreiben. Die API-Datei implementiert nur den Refresh-Token-Abruf und die GET-Review-Abfrage; der einmalige Consent-Flow ist separat durch den berechtigten Inhaber/Techniker auszuführen. Auf https://developers.google.com/identity/protocols/oauth2/web-server ist der offizielle Ablauf beschrieben. Google empfiehlt die erprobte PHP-Clientbibliothek für den Consent-Flow.
4. Account-ID und Location-ID des bestätigten Thermofis-Profils ermitteln. IDs ohne `accounts/` bzw. `locations/` eintragen. Eine Maps Place ID ist hier kein Ersatz.
5. Exakten Google-Profil-Link vom Inhaber prüfen lassen und als HTTPS-URL eintragen. Ohne verifizierten Link bleibt die neutrale Google-Suche bestehen. Zwölf Rezensionen und 5,0 werden nicht fest einprogrammiert; die Werte kommen ausschließlich von Google.

Die ZIP enthält keinen privaten Schlüssel, keinen OAuth-Consent-Callback und keine realen Rezensionen. Die manuelle Konto-Verbindung kann ohne Inhaber-Zustimmung nicht abgeschlossen werden. OAuth-App-Verifizierung/Produktionsstatus und Widerruf anhand des tatsächlichen Projekts prüfen; keine dauerhaft laufende Integration auf eine unpassende Test-Konfiguration stützen.

## 2. Private Konfiguration neben public_html

Im Hostinger-Dateimanager eine Ebene über `public_html` wechseln. Dort einen Ordner `thermofis-private` anlegen. Den Inhalt der öffentlichen **Beispieldatei** `integration/google-reviews-config.example.php` in eine neue private Datei `thermofis-private/google-reviews-config.php` kopieren. Erst in dieser privaten Kopie die Google-Zugangsdaten eintragen. Die öffentliche Beispieldatei bleibt leer.

Zielstruktur:

| Pfad relativ zum Domain-Verzeichnis | Inhalt | Öffentlich? |
|---|---|---|
| `public_html/api/google-reviews.php` | Sicherer JSON-Endpunkt | Ja, keine Schlüssel |
| `public_html/assets/js/google-reviews.js` | Darstellungslogik | Ja, keine Schlüssel |
| `public_html/integration/google-reviews-config.example.php` | Leeres Beispiel | Ja, keine Schlüssel |
| `thermofis-private/google-reviews-config.php` | Echte OAuth-Konfiguration | Nein |
| `thermofis-private/cache/` | Kurzlebiger, unveränderter Google-Rohcache | Nein |

Die API findet diese private Datei automatisch. Ihr `cache_dir` kann unverändert `__DIR__ . '/cache'` bleiben: nach dem Kopieren zeigt dies in den privaten Ordner. Berechtigungen für `thermofis-private` und `cache`: 0700; für private Konfiguration und Cachedateien: 0600. Der PHP-Prozess muss mit dem berechtigten Hostingbenutzer lesen/schreiben können. Die API weist Konfigurations- und Cachepfade innerhalb des Website-Verzeichnisses oder Document Root zurück; keine öffentliche Alternative verwenden.

Falls die Hostingverzeichnisse anders organisiert sind, kann `THERMOFIS_GOOGLE_CONFIG_FILE` einen anderen absoluten privaten Pfad vorgeben. Optional können alle Einstellungen über die PHP-Prozessumgebung überschrieben werden:

| Variable | Einstellung |
|---|---|
| `THERMOFIS_GOOGLE_CLIENT_ID` | OAuth Client ID |
| `THERMOFIS_GOOGLE_CLIENT_SECRET` | OAuth Client Secret |
| `THERMOFIS_GOOGLE_REFRESH_TOKEN` | Refresh Token |
| `THERMOFIS_GOOGLE_ACCOUNT_ID` | Account-ID ohne Prefix |
| `THERMOFIS_GOOGLE_LOCATION_ID` | Location-ID ohne Prefix |
| `THERMOFIS_GOOGLE_CACHE_DIR` | Absoluter privater Cacheordner |
| `THERMOFIS_GOOGLE_MAPS_URL` | Vom Inhaber bestätigte Google-Profil-URL |

Keine geheimen Variablen in die öffentliche `.htaccess` oder HTML schreiben. Der automatische private Dateipfad ist für klassische Hostinger-PHP-Pakete der einfachere Weg.

## 3. Aktualisierung und Aufbewahrung

Beim Besuch des Bewertungsbereichs lädt der Browser ausschließlich den Endpunkt derselben Website. Der Server erneuert gültige Daten nach sechs Stunden; gleichzeitige Abrufe werden durch eine private Dateisperre begrenzt. OAuth- und Review-Aufrufe gehen nur zu den fest definierten Google-HTTPS-Endpunkten, mit verifiziertem TLS und maximal 18 Sekunden Gesamtzeit. Maximal fünf Seiten mit jeweils 50 Bewertungen werden abgerufen. In der Website erscheinen die ersten sechs, nach Googles `updateTime desc`, ohne Filter nach Sternezahl. Gesamtzahl und Durchschnitt stammen aus Googles Antwort, nicht aus dieser Auswahl.

Bei einem vorübergehenden Fehler kann die bisherige Antwort bis zur 24-Stunden-Grenze weiter angezeigt werden; das ursprüngliche Aktualisierungsdatum bleibt erhalten. Nach 24 Stunden liefert die API keine alten Rezensionen mehr aus und löscht den abgelaufenen Cache beim nächsten Aufruf. Neue Fehler werden höchstens alle 15 Minuten erneut geprüft.

**Für garantierte physische Aufbewahrungsfristen muss ein regelmäßiger Job auch dann laufen, wenn niemand die Website besucht.** Ohne diesen Job begrenzt die API zwar die Anzeige auf 24 Stunden, eine unbesuchte Datei könnte länger auf der Festplatte liegen. Vor Aktivierung der Live-Verbindung deshalb in Hostinger einen Cronjob alle sechs Stunden einrichten und zusätzlich die nachfolgende Löschung älterer Dateien vor jedem Abruf vorsehen. Die Löschschwelle ist vorsorglich 18 Stunden: mit einem zuverlässig laufenden Sechs-Stunden-Job wird die Datei spätestens innerhalb von 24 Stunden entfernt, wenn sie nicht vorher erneuert wurde. Cachedateien außerdem von dauerhaften Backups/Archiven ausschließen. Google erlaubt einen begrenzten, sicheren Performancecache maximal 30 Tage; diese Integration verwendet bewusst eine deutlich kürzere 24-Stunden-Grenze. Quelle: https://developers.google.com/my-business/content/policies

Konkrete Cron-Kommandos müssen mit den absoluten Hostinger-Pfaden des Kontos ausgefüllt werden. `HOSTING_DOMAIN_DIR` ist ein Platzhalter, kein echter Verzeichnispfad:

```bash
find /HOSTING_DOMAIN_DIR/thermofis-private/cache -maxdepth 1 -type f -name 'reviews.json' -mmin +1079 -delete
```

Anschließend den PHP-Endpunkt im selben Cronjob bzw. einem unmittelbar folgenden Job über die vom Hosting angegebene PHP-CLI ausführen:

```bash
/HOSTING_PHP_CLI /HOSTING_DOMAIN_DIR/public_html/api/google-reviews.php > /dev/null 2>&1
```

Der CLI-Aufruf gilt im Skript als GET und bleibt ausschließlich lesend gegenüber Google; er erstellt keine Rezensionen und sendet keine Nachrichten. Die Ausgabe muss nach `/dev/null` gehen, damit die Cron-Verwaltung keine personenbezogenen Rezensionstexte per E-Mail versendet oder als dauerhafte Logkopie speichert. Der Löschjob muss unabhängig von einem erfolgreichen Google-Abruf funktionieren. `find`/PHP-CLI-Pfade und Cron-Verhalten zuerst im konkreten Hostingkonto prüfen. Die 24-Stunden-Grenze bezieht sich auf den letzten erfolgreichen Abruf, nicht auf Dateidatum-Umschreiben.

Wenn die Verbindung beendet wird: private Konfiguration/Token entfernen bzw. OAuth-Zugriff widerrufen und private `reviews.json` manuell löschen. Ein Cronjob ohne echten Token dient dann nur der Löschung, nicht der Google-Verbindung.

## 4. Vor Veröffentlichung prüfen

1. Ohne Konfiguration muss `/api/google-reviews.php` JSON mit `status: "not-configured"` liefern und keinerlei Google-Aufrufe auslösen.
2. Mit vollständiger privater Konfiguration muss `status: "ready"` erscheinen. Google-Gesamtzahl/-Mittelwert und einige Originaltexte mit dem Unternehmensprofil vergleichen.
3. Prüfen, dass private Konfiguration und Cache über die Domain nicht abrufbar sind; kein Secret in Browsernetzwerk, Seitenquelltext oder ZIP.
4. Cron-Ausführung und frischen API-Zeitstempel prüfen. Danach abgelaufene Testcachedatei verwenden und bestätigen, dass sie gelöscht wird. Keine Rezensionstexte in Testlogs speichern.
5. Auf Smartphone und Desktop: sechs Karten, deutsche Datumsanzeige, Originaltexte, lesbarer Durchschnitt, transparente Auswahlbeschreibung und korrekter Link. Es werden bewusst keine externen Profilbilder geladen; die Kundeninitialen sind reine Darstellung.
6. Datenschutzerklärung um den tatsächlichen Einsatz ergänzen. Keine „Google-verifizierter Kauf“-Badges, keine KI-Umschreibung und keine eigenen Review-Rich-Result-Sterne versprechen.

## Stand der Prüfung dieser Vorschau

- `google-reviews.js` wurde mit `node --check` auf Syntax geprüft.
- PHP wurde statisch auf Schlüsseltrennung, feste Ziel-URLs, GET-Verhalten, Timeout, Cacheablauf, Dateiberechtigungen und sichere Fallbacks geprüft.
- In der Arbeitsumgebung war kein PHP-Interpreter vorhanden; PHP-Lint und echte Endpoint-Ausführung wurden daher nicht ausgeführt. Auch ein Browserlauf für den Review-Renderer konnte hier mangels Chromium-Binary nicht durchgeführt werden.
- Die echte Google-Anbindung wurde nicht getestet oder aktiviert, da keine API-Freigabe/OAuth-Zugangsdaten vorliegen. Vor Live-Veröffentlichung die oben beschriebenen Prüfungen im PHP-Hosting durchführen.

Offizielle technische Quellen: Reviews-Methode https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list ; OAuth https://developers.google.com/my-business/content/implement-oauth ; Echtzeit-Alternative https://developers.google.com/my-business/content/notification-setup .
