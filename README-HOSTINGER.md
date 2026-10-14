# Thermofis – überarbeitete Website, Vorschau vom 14.10.2026 – Revision 8

Die Online-Website wurde nicht verändert. Dieses Paket ist eine separate Entwurfsversion. Die ursprüngliche ZIP bleibt erhalten.

## Aktueller Abschlussstand: Revision 8

- Das Original-Autofoto liegt weiterhin hinter dem Hero-Text. Die helle Überlagerung ist reduziert und läuft mobil unter den Buttons vollständig aus, damit der Wagen erkennbarer bleibt. Der frühere weiße Vertrauensbalken über dem Auto bleibt entfernt.
- Zwei gleich breite, gleich hohe Hero-Buttons stehen untereinander: Termin rot, „Technik in 3D entdecken“ dunkelblau. Der Budgetplaner bleibt über die Navigation erreichbar; Hinweise „kein Angebot“ bleiben erhalten.
- Ruhigere Gestaltung: weniger schwebende Kästen, runde Kategorien und doppelte Einstiegspunkte. Die Ablaufsektion verwendet einfache Schritte statt Effektkarten. Heizungsbau und Bad zeigen echte Projektbilder; die allgemeine Meister-Illustration wird durch ein Foto eigener Arbeiten ersetzt.
- Alle zehn echten Referenzfotos und das Original-Autofoto sind bytegleich erhalten. Vier gekennzeichnete KI-Leistungsillustrationen bleiben für Bereiche ohne passende Originalaufnahme. Die Bilddateien und ursprünglichen Prompts aus Revision 5 bleiben im Paket.
- Marken laufen weiterhin ohne Pause-Button und ohne sichtbaren Scrollbalken. Hover/Berührung zeigt Farbe, die Bewegung läuft weiter. Die Einstellung für reduzierte Bewegung wird respektiert.
- Der Bewertungsbereich mit Balken und Karten enthält jetzt alle 17 gelieferten Rezensionen: 13 Google, vier MyHammer. Sechs Karten sind direkt sichtbar, elf über eine native Aufklappfunktion. Quellen und Auszüge sind gekennzeichnet; zwei Rezensionen erscheinen ohne Text.
- Die Bewertungen werden manuell in `index.html` gepflegt. Es gibt keinen API-Abruf und keine Zugangsdaten. Die kurze Pflege- und Umstiegsanleitung steht in `integration/BEWERTUNGEN-PFLEGEN.md`.
- Versionierte CSS-/JavaScript-URLs verhindern veraltete Assets im normalen Browser-Cache. Auf dem Hosting zusätzlich vorhandene Seiten-/CDN-Caches leeren.

Das ZIP enthält `CNAME` mit der bestehenden GitHub-Vorschaudomain `thermofis.rateriser.tech` und `.nojekyll`. Bei erneutem Upload auf dieselbe GitHub-Vorschau diese Dateien erhalten, damit die benutzerdefinierte Domain nicht wieder aus den Quelldateien verschwindet. Die tatsächliche GitHub-Pages-Einstellung gegebenenfalls separat prüfen. Für Hostinger sind diese beiden Dateien ohne Funktion und können weggelassen werden; DNS oder Hosting werden durch dieses Paket nicht umgestellt.

## Enthaltene Funktionen

- Überarbeitete Startseite mit klaren Wegen zu Leistungen, interaktiver Technik und Kostenplanung; gleiche Markenfarben, Original-Logo, vorhandene Projektbilder und gezielt gestraffte Texte.
- Gemeinsame CSS-Dateien, kompaktere Navigation, bessere Lesbarkeit auf kleinen Bildschirmen, Tastaturfokus, verständliche Formularlabels und Rücksicht auf reduzierte Bewegung.
- Sieben drehbare 3D-Schemata: Luft-Wasser-Wärmepumpe, Fußbodenheizung, indirekter Trinkwasserspeicher, hydraulischer Abgleich, Gas-Brennwertgerät, Öl-Brennwertkessel mit Tank und Enthärtungsanlage mit Regeneration. Bauteile auswählen, auseinanderziehen und Wärme-/Wasserflüsse starten. Lokale Geometrie und Animation, keine externen Modelle/CDNs oder WebGL-Abhängigkeit.
- Wärmepumpen-Budget und Fußbodenheizungs-Kalkulation mit optionalem Förderszenario. Bruttopreise einschließlich 19 % USt., deutsche Zahlformatierung, nachvollziehbare Rechnung, E-Mail-Entwurf und Druck/PDF-Funktion.
- Statische Kundenbewertungen aus den vom Auftraggeber gelieferten Originalangaben. Sie sind ohne JavaScript und ohne externe Verbindung sichtbar; Aufklappen funktioniert über natives HTML. Kein behaupteter Gesamtstand oder Durchschnitt des Google-Profils.
- Aktualisierte, eng begrenzte Fördertextkorrekturen: KfW statt BAFA beim Heizungstausch, private Antragstellung und Vertrag mit Förderbedingung, keine pauschale PV-Kostenfreiheit; geschlossene Zuschussförderung 455-B nicht mehr versprochen.
- Karten laden erst nach Einwilligung. Seiten ohne Karte zeigen keinen unnötigen Karten-Cookie-Banner.

## Vorschau ansehen

`Thermofis-Vorschau.html` ist eine einzelne Datei mit eingebetteten Bildern, Stilen und Skripten. Herunterladen und in einem aktuellen Browser öffnen. Die sieben Technikmodelle und der Budgetrechner benötigen einen Browser, der JavaScript ausführt. Die iPhone-Dateivorschau ist kein verlässlicher Funktionstest; sie kann Skripte einschränken. Für die mobile Prüfung die unten beschriebene Test-Subdomain über HTTPS in Safari oder Chrome öffnen. Die Einzeldatei zeigt zusätzlich alle sieben Modelle als eingebettete PNG-Grafiken, falls die Skripte nicht laufen. Die Links zu bestehenden Unterseiten öffnen die aktuell veröffentlichte Website; die überarbeiteten Fassungen dieser Unterseiten sind vollständig im ZIP enthalten. Alle 17 gelieferten Rezensionen sind fest in der Einzeldatei enthalten und brauchen weder Netzverbindung noch JavaScript.

Der Rechner heißt ausdrücklich „Unverbindliche Budgetplanung – kein Angebot“. Dieser Hinweis erscheint vor den Eingaben, direkt im Ergebnis, in der Druckansicht und im E-Mail-Entwurf. Die Preise 32.000 € und 100 €/m² sind editierbare Beispielannahmen. Sie sind ausdrücklich keine THERMOFIS-Preisliste und keine erhobenen Marktpreise. Ein Besucher erhält keine vermeintliche Heizlast-/Anlagenplanung aus seiner Wohnfläche. Förderzahlen sind Szenarien unter den eingegebenen Voraussetzungen, keine Bewilligung. Einkommen bleibt im Browser und wird im E-Mail-Entwurf nicht übernommen.

## Separat auf Hostinger testen

1. Eine Test-Subdomain mit eigenem Verzeichnis anlegen. Die bestehende Domain und ihr `public_html` nicht überschreiben.
2. Inhalte dieses ZIP in das neue Webroot entpacken: `index.html`, `assets/`, alle Leistungsseiten und `api/` liegen unmittelbar im Webroot. Die aktuellen Pfade sind für ein eigenes Domain-/Subdomain-Webroot gedacht, nicht für einen einfachen Unterordner unter der bestehenden Domain.
3. HTTPS aktivieren und das Hosting auf PHP 8.1 oder neuer mit cURL/JSON prüfen. Die statischen Seiten und Modelle brauchen PHP nicht; die serverseitige Förderquellenprüfung schon.
4. Formulare und Telefon-/Mail-/WhatsApp-Links im Test mit geeigneten Beispieldaten prüfen. Die vorhandene Kontaktseite öffnet einen WhatsApp-Entwurf; erst der Besucher sendet in WhatsApp. Beim Rechner öffnet der Button das Mailprogramm und sendet nichts automatisch.
5. Die Entwurfsversion ist auf `noindex, nofollow` gesetzt; zusätzlich per Hosting-Passwort schützen. `noindex` ist kein Zugriffsschutz. Vor einer später ausdrücklich gewünschten Veröffentlichung die Robots-Metaangaben auf `index, follow` ändern und Canonical/Sitemap/Domain prüfen.
6. Vor Austausch der Live-Dateien eine Sicherung des tatsächlichen aktuellen Hostinger-Verzeichnisses erstellen. Die ursprüngliche Upload-ZIP ist nur der gelieferte Ausgangsstand.

## Bewertungen manuell pflegen

Alle Inhalte stehen im markierten Abschnitt `KUNDENBEWERTUNGEN` der `index.html`. Neue Karten dort ergänzen, Quelle und tatsächliche Sternezahl übernehmen, die angezeigten Anzahlen sowie den Pflegestand aktualisieren. Die vollständige Anleitung ist `integration/BEWERTUNGEN-PFLEGEN.md`. Sechs Karten bleiben direkt sichtbar, weitere Karten werden nativ aufgeklappt.

API-Endpunkt, Google-JavaScript und OAuth-Beispielkonfiguration sind aus dieser Version entfernt. Ein ZIP-Upload löscht keine alten Serverdateien: bei einem Update von früheren Versionen die in der Pflegeanleitung aufgelisteten Google-Dateien gezielt entfernen und einen eventuell eingerichteten Google-Cron beenden. Die getrennte Förderquellenprüfung bleibt davon unberührt.

## Förderinformationen aktuell halten

Rechenregeln liegen zentral in `assets/js/foerder-regeln.js`, der Prüfstatus in `assets/data/foerder-status.json`. Der Stand ist 13.10.2026. Nach mehr als 30 Tagen ohne Quellenprüfung blendet der Rechner Förderbeträge aus. Ab 01.01.2027 sperrt er die Wärmepumpenförderung zusätzlich bis zur fachlichen Prüfung der angekündigten neuen Konditionen; spätestens nach dem 31.01.2027 ist die gesamte aktuelle Konfiguration abgelaufen.

`maintenance/check-funding.php` ist ein reines CLI-Skript. Es vergleicht die amtlichen KfW-/BAFA-Seiten und das Merkblatt mit einer redaktionell freigegebenen Vergleichsbasis. Änderungen oder unerreichbare Quellen setzen den Status auf `needs-review` bzw. `unavailable`; Förderbeträge werden dann ausgeblendet. Das Skript erfindet keine neuen Rechenregeln und verschickt keine E-Mails. Seitenänderungen können auch rein redaktionell sein, deshalb ist die fachliche Nachprüfung nötig.

Einrichtung auf der Test-Subdomain:

1. Neben deren Webroot `thermofis-private/funding` anlegen, mit privaten Berechtigungen 0700. Der PHP-Benutzer benötigt Schreibzugriff auf diesen Ordner und auf `assets/data/foerder-status.json`. Alternativ `THERMOFIS_FUNDING_STATE_DIR` auf einen anderen privaten absoluten Pfad setzen.
2. Offizielle Quellen, zentrale Rechenregeln und datierte Erläuterungen fachlich vergleichen. `checkedAt`, `reviewDue`, Gültigkeit und Rechenwerte nur nach dieser Prüfung aktualisieren. Die angekündigten 2027-Änderungen verlangen eine neue Implementierung/Tests, kein bloßes Verlängern des Datums.
3. Erst danach die Vergleichsbasis freigeben. Beispiel, tatsächliche PHP-/Domainpfade ersetzen:

```bash
/HOSTING_PHP_CLI /HOSTING_DOMAIN_DIR/public_html/maintenance/check-funding.php --approve-baseline
```

4. Im Hostinger-Cron einen täglichen Job vom Typ PHP auf den tatsächlichen Pfad `/HOSTING_DOMAIN_DIR/public_html/maintenance/check-funding.php` einrichten. Keine Ausgabeumleitung in das PHP-Pfadfeld schreiben; der Job gibt einen Prüfstatus aus.

5. In der Testumgebung eine geänderte Vergleichsbasis und einen fehlgeschlagenen Quellenabruf simulieren: beide müssen Förderzahlen sperren. Ein unveränderter, erfolgreicher Abgleich muss sie bei sonst gültigen Regeln zulassen. Wenn der Server amtliche Seiten nicht abrufen kann, bleibt die Berechnung gesperrt; dann Quellen manuell prüfen und die Abrufmöglichkeit lösen.

6. Zusätzlich monatlich die Rechtslage und regionalen Programme prüfen. Ein Quellenvergleich ersetzt keinen Fachverantwortlichen. Während der Übergangsphase mindestens zum Jahreswechsel und vor dem 01.02.2027 nachprüfen. Das vorbereitete Skript wurde hier nicht im Hostinger-Konto aktiviert.

## Prüfung und Grenzen

Revision 8 prüft gezielt alle 17 Karten gegen die gelieferten Namen, Quellen, Sterne und Texte, außerdem sechs Auszüge, zwei Bewertungen ohne Text, die Aufklappfunktion ohne Skripte und das Fehlen der alten Google-Abfrage. Die CSS-Kaskade wird für elf Breiten von 320 bis 1920 Pixel geprüft. Alle 15 HTML-Seiten werden auf lokale Verweise, Anker, eindeutige IDs, H1 und JSON-LD geprüft; JavaScript wird auf Syntax geprüft. Alle elf geschützten Originalbilder sind per SHA-256 unverändert.

Hero, Markenlauf, sieben Technikmodelle, Budgetrechner und Förderregeln wurden in dieser Revision nicht geändert. Frühere Prüfungen ihrer Logik bleiben dokumentiert; sie wurden wegen der reinen Bewertungsänderung nicht erneut vollständig ausgeführt.

Ein visueller Browser-/Gerätetest steht weiterhin aus. Hier wurden Code und CSS-Regeln geprüft, keine gerenderte Seitenansicht und keine echte Touchhardware. Die PHP-Ausführung und der Förderquellen-Cron müssen auf dem Testhosting geprüft werden. Es wurde nichts live veröffentlicht.

Die bisherige Förderrecherche steht in `FOERDERQUELLEN.md`. Neue Förderinformationen wurden im Rahmen dieser Bewertungsänderung nicht recherchiert.

## Bedienung

Auf schmalen Bildschirmen und Tablets bis 1100 Pixel wird ein natives Menü verwendet. Die Markenleiste läuft im sichtbaren Bereich automatisch; bei reduzierter Bewegung oder ohne JavaScript lässt sie sich manuell verschieben.

Die sieben Technikmodelle verwenden nummerierte Bauteile und Erklärungen. Das Handy-Auswahlfeld ersetzt die breite Themenleiste. Gas-, Öl- und Enthärtungsmodelle erklären die Technik schematisch, ohne eine pauschale Einbau- oder Förderempfehlung zu geben. Bei blockiertem JavaScript sind alle sieben Ansichten als PNG-Bilder verfügbar. Diese Bilder werden nicht als interaktive 3D-Ansicht ausgegeben.

## Desktop- und Handyprüfung auf dem Testhosting

1. Die HTTPS-Adresse der separaten Test-Subdomain direkt in Safari öffnen, nicht die heruntergeladene HTML-Datei in der Dateivorschau. Anschließend nach Möglichkeit auch Chrome/Android testen.
2. Desktop bei etwa 1024, 1440 und 1920 Pixel sowie Handy im Hoch- und Querformat: Logo, Hero-Hintergrund, Navigation und alle Karten dürfen keinen seitlichen Seitenüberlauf erzeugen. Menü öffnen, einen Link wählen, zurückkehren.
3. Die Marken müssen ohne Start-/Pause-Button gleichmäßig laufen. Mehrere Logos berühren: Farbe erscheint, der Lauf geht weiter. Die Seite bleibt dort vertikal scrollbar. Mit systemweit reduzierter Bewegung ist die Leiste stattdessen manuell scrollbar.
4. Alle sieben Modelle auswählen. Innerhalb der Modellfläche horizontal und vertikal ziehen: Nur das Modell soll sich drehen, die Seite darf dabei nicht mitscrollen. Finger lösen und neben der Modellfläche scrollen: Die Seite muss sich wieder normal bewegen. Auch eine zweite Berührung und unterbrochene Gesten prüfen. Pfeiltasten/Buttons verwenden, Bauteile antippen, Ansichten trennen/zusammensetzen. Bei Enthärtung „Regeneration zeigen“, beim Abgleich den Vergleich testen. Hoch-/Querformat wechseln.
5. Flussanimation starten und pausieren; beim Verlassen der Ansicht und im Hintergrund darf keine dauerhafte unnötige Animation laufen.
6. Beim Budgetrechner Betrag bzw. Fläche ändern, ungültige Eingaben prüfen, optionale Förderangaben aufklappen. „Kein Angebot“ muss vor und nach Eingaben sowie im Druckergebnis sichtbar sein.
7. Eine Beratungs-E-Mail öffnen: persönliche Budgetannahme und Hinweis auf fehlendes Angebot enthalten, sensible Einkommensangaben nicht enthalten. Nichts automatisch versenden.
8. JavaScript testweise deaktivieren: Menü und Links bleiben bedienbar; sieben statische Modellansichten erscheinen. Der Rechner blendet inaktive Eingabefelder aus und erklärt die Einschränkung.
9. Bewertungsbereich prüfen: sechs Karten sichtbar, weitere elf aufklappbar; alle 17 mit korrekter Quellenangabe. Das muss auch ohne JavaScript funktionieren. Keine API-Einrichtung nötig.

## Den Budgetplaner fachlich freigeben

Die aktuelle Version rechnet ein selbst gewähltes Budget und gegebenenfalls Förderannahmen durch. Sie ermittelt noch keinen Projektpreis aus Gebäudeangaben. Das ist eine bewusste Produktgrenze und muss auch in der Kundenkommunikation so bleiben.

Für einen späteren Kostenorientierungsrechner empfiehlt sich eine kleine, vom Betrieb gepflegte Preismatrix aus echten abgeschlossenen Projekten: typischer Leistungsumfang, Kostenkorridor, Datum, enthaltene Arbeiten und Ausschlüsse. Daraus eher einen Bereich als einen scheinbar präzisen Festpreis anzeigen. Erst nach Freigabe dieser Daten den Rechner als Kostenschätzung für neue Projekte bezeichnen. Der Zusatz „kein Angebot“ allein macht unrealistische Preisannahmen nicht aussagekräftig.

Für Werbeeinrichtung liegt marketing/CHATGPT-ADS.md bei. Es wurde keine Kampagne angelegt oder Geld ausgegeben.

Sicherheitsquellen für die Notdienst-Korrekturen: [DVGW – Gasgeruch](https://www.dvgw.de/themen/gas/verbraucherinformationen/was-tun-bei-gasgeruch), [Bundesärztekammer – Kohlenmonoxid-Vergiftung](https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Patienten/Patienteninformationen/Kohlenmonoxid-Vergiftung-kip.pdf). Geprüft am 13.10.2026.
