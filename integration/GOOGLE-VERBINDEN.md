# Thermofis mit echten Google-Bewertungen verbinden

Stand: 13.10.2026. Einrichtungsanleitung für die vorbereitete Website; die Verbindung wurde noch nicht aktiviert.

Ja: Die Bewertungen können sich automatisch aktualisieren, während die Zugangsdaten für Websitebesucher verborgen bleiben. Bei der vorbereiteten Lösung ruft PHP auf dem Hostinger-Server Google ab. Der Browser bekommt ausschließlich Rezensionstexte, Sterne, Namen und die Bewertungszahl. Die Geheimnisse stehen in einer privaten Datei außerhalb des öffentlich erreichbaren Websiteordners.

Für Google Business Profile benutzen wir **OAuth**, also eine vom berechtigten Google-Konto erteilte Zugriffsberechtigung. Ein einfacher API-Key genügt für diesen Weg nicht. Eine Client-ID ist eine Kennung; `client_secret` und `refresh_token` sind die wirklich geheimen Werte.

1. **Zugriff auf das Unternehmensprofil klären.** Der Thermofis-Inhaber kann selbst zustimmen oder Haruns Google-Konto als Manager hinzufügen. Dafür muss er kein Passwort weitergeben. Offizielle Anleitung: https://support.google.com/business/answer/3403100 .

2. **Google-Freigabe beantragen.** In https://console.cloud.google.com/ ein Projekt auswählen/anlegen und dessen **Projektnummer** notieren. Dann mit dem berechtigten Konto https://support.google.com/business/contact/api_default öffnen und „Application for Basic API Access“ auswählen. Google verlangt ein verifiziertes, seit mindestens 60 Tagen aktives Profil und eine im Profil hinterlegte Betriebswebsite. Der Formular-Link stammt aus Googles Voraussetzungen-Dokument; ohne Anmeldung kann er ins allgemeine Helpcenter weiterleiten. Die Freigabe kommt nach Googles Prüfung, nicht automatisch durch das Anlegen eines Schlüssels. Für Agenturen nennt Google zusätzlich ein Business-Profile-Organization-Konto; das ist keine kostenpflichtige Google-Workspace-Pflicht. Bei der Agentur-Antragskonfiguration diese Vorgabe mitprüfen. Offizielle Voraussetzungen: https://developers.google.com/my-business/content/prereqs .

3. **Das Google-Konto einmal autorisieren.** Nach der Freigabe in https://console.cloud.google.com/apis/library die von Google genannten Business-Profile-APIs aktivieren und einen OAuth-Client vom Typ „Webanwendung“ erstellen. Für die einmalige Einrichtung kann Googles offizieller https://developers.google.com/oauthplayground/ dienen: eigene OAuth-Credentials auswählen, Flow „Server-side“, Endpoints „Google“, Access type „Offline“. Die Redirect-URI des Clients lautet dafür exakt `https://developers.google.com/oauthplayground`. Scope `https://www.googleapis.com/auth/business.manage` autorisieren und den Code gegen Tokens austauschen. Der berechtigte Inhaber/Manager bestätigt dabei selbst. Client Secret und Refresh Token danach direkt in die private Hostinger-Datei übernehmen; keine Screenshots oder Links mit Tokens teilen. Die Geheimnisse werden bei diesem privaten Einrichtungsprozess Google anvertraut, aber später nicht an Websitebesucher ausgeliefert.

4. **Die Daten bei Hostinger privat hinterlegen.** Im Dateimanager eine Ebene über `public_html` wechseln und dort `thermofis-private` anlegen. Die leere Beispieldatei in eine neue Datei `thermofis-private/google-reviews-config.php` kopieren. Erst diese private Kopie mit OAuth-Daten, Account-ID, Location-ID und bestätigtem Google-Profil-Link ausfüllen. `cache_dir` bleibt `__DIR__ . '/cache'`. Die vorhandene API findet diese private Datei automatisch. Niemals die öffentliche Datei `integration/google-reviews-config.example.php` mit echten Geheimnissen ausfüllen. Berechtigungen: private Ordner 0700, Konfiguration/Cachedateien 0600.

5. **Verbindung und Aktualisierung prüfen.** `/api/google-reviews.php` muss dann `status: "ready"` und die echten Google-Daten liefern. Im Browsernetzwerk und Seitenquelltext dürfen keine Tokens auftauchen. Google-Gesamtzahl, Durchschnitt und Texte mit dem Profil vergleichen. Den dokumentierten Hostinger-Cronjob für Aktualisierung und fristgerechte Cachelöschung einrichten; Ausgabe nach `/dev/null`, damit Rezensionen nicht in Cron-E-Mails oder dauerhaften Logs landen. Die vorbereitete Anzeige erneuert nach sechs Stunden und zeigt Daten höchstens 24 Stunden alt.

Wichtig für Schritt 3: Googles Playground-Standardcredentials widerrufen Refresh Tokens nach 24 Stunden; daher **eigene** OAuth-Credentials verwenden. Ein externes OAuth-Projekt mit Status „Testing“ kann dennoch Tokens mit sieben Tagen Laufzeit ausgeben. Für einen dauerhaften Betrieb deshalb Produktionsstatus und eventuell erforderliche Google-App-Verifizierung prüfen. Eine unbefristete Token-Laufzeit nicht versprechen: der Inhaber kann den Zugriff jederzeit widerrufen.

| Weg | Vorteil | Was zu beachten ist |
|---|---|---|
| Google-Profil verlinken | Sofort ohne API möglich | Bewertungen stehen auf Google, nicht automatisch als Karten auf der Website |
| Eigene vorbereitete GBP-Anbindung | Google-API kostenlos; volle Kontrolle über Gestaltung; alle Bewertungen grundsätzlich abrufbar | Einmalige API-Freigabe und Konto-Zustimmung nötig |
| Fertiges Drittanbieter-Widget | Kann Einrichtung vereinfachen | Weitere Anbieterabhängigkeit, mögliche laufende Kosten und eigene Datenschutz-/Integrationsbedingungen |

Für Thermofis empfehle ich die vorbereitete eigene Anbindung. Die öffentliche HTML-Datei darf weiterhin lesbar sein: darin liegt nur die Darstellung. Geheimhaltung entsteht durch die serverseitige Verarbeitung und die private Datei, nicht durch Verschleiern von HTML.

