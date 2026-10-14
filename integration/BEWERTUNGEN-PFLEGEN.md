# Google- und MyHammer-Bewertungen manuell pflegen

Stand: 14.10.2026 · Revision 8

Die Bewertungen sind jetzt fester Bestandteil der Startseite. **Keine Google-API, keine Freigabe, kein Schlüssel und kein Google-Cronjob sind nötig.** Dein Kunde gibt dir neue Rezensionen weiter; du ergänzt sie bei der Websitepflege.

## 1. Was bereits eingebaut ist

- Alle 17 gelieferten Bewertungen: 13 von Google und vier von MyHammer, jeweils mit der übermittelten Bewertung von fünf Sternen.
- Sechs Karten sind sofort sichtbar. Die übrigen elf lassen sich über „Weitere 11 Bewertungen ansehen“ öffnen – auch ohne JavaScript.
- Sechs gekürzte Texte sind als „Auszug“ gekennzeichnet. Die fehlenden Enden wurden nicht ergänzt. Wenn du später die vollständigen Originaltexte bekommst, kannst du diese einsetzen und die Auszug-Markierung entfernen.
- K.Z und Valdrin Shabani erscheinen ohne Rezensionstext, weil kein Text geliefert wurde.
- Jede Karte nennt ihre Quelle. Die 17 sind die Anzahl auf dieser Website, kein behaupteter Gesamtstand des Google-Profils. Ein plattformübergreifender Bewertungsdurchschnitt wird nicht angezeigt.
- Relative Angaben wie „vor einem Monat“ und „Neu“ werden nicht festgeschrieben. Stattdessen steht unter dem gesamten Bereich der Pflegestand 14.10.2026. Das ist kein Veröffentlichungsdatum der einzelnen Rezensionen.

## 2. Diese ZIP auf Hostinger verwenden

Den Inhalt von `Thermofis-Hostinger-Vorschau.zip` in das eigene Webroot der Test-Subdomain entpacken. Dort müssen `index.html`, `assets/` und die Seitenordner direkt liegen. Das bestehende Live-Verzeichnis vorher sichern und die Überarbeitung zunächst auf der Testadresse prüfen.

Die Bewertungen sind nach dem Hochladen sofort sichtbar. Es gibt keinen Verbindungsschritt zu Google. In der einzelnen Datei `Thermofis-Vorschau.html` sind dieselben Rezensionen ebenfalls enthalten.

Falls du eine frühere Version bereits hochgeladen hast: ZIP-Entpacken entfernt keine alten Dateien. Die folgenden alten Dateien werden nicht mehr benötigt und können nach einer Sicherung gezielt entfernt werden:

- `api/google-reviews.php`
- `assets/js/google-reviews.js`
- `integration/google-reviews-config.example.php`
- `integration/GOOGLE-SETUP.md`
- `integration/GOOGLE-VERBINDEN.md`

Nur falls tatsächlich schon eingerichtet: den Cronjob für `api/google-reviews.php` beenden und die zugehörigen Google-Zugangsdaten/Review-Caches im privaten Ordner entfernen. **Den getrennten Förderquellen-Job nicht entfernen.** Eine bestehende Google-Berechtigung kannst du bei Bedarf im verbundenen Google-Konto widerrufen; allein das Entfernen der Website-Dateien widerruft sie nicht.

## 3. Neue Bewertung einpflegen

Die einzige öffentliche Inhaltsquelle ist **`index.html`**. Suche darin nach `KUNDENBEWERTUNGEN`. Der Bereich ist mit Anfangs- und Endkommentar markiert. Es gibt keine zweite Datenbank oder Bewertungsdatei, die zusätzlich aktualisiert werden muss.

- Eine vorhandene Karte von `<article class="google-review-card"` bis `</article>` kopieren. Für eine weitere Rezension die Kopie in das Raster innerhalb von `<details class="google-reviews-more">` einsetzen, vor dessen schließendem `</div>`.
- Name, Initialen, Originaltext und Quelle ersetzen. Die vier anonym übermittelten MyHammer-Rezensionen bleiben „Rezensent von MyHammer“; keine Namen erraten.
- `data-review-id` eindeutig vergeben, beispielsweise `google-neuer-name-2026-11`. Die Kennung wird nicht angezeigt.
- Die Sterne, `aria-label` und `data-review-rating` an die tatsächliche Bewertung anpassen. Für vier Sterne beispielsweise `★★★★☆`, `aria-label="4 von 5 Sternen"` und `data-review-rating="4"` einsetzen.
- Quelle an beiden Stellen konsistent halten: `data-review-source="Google"` oder `"MyHammer"` und der sichtbare Text „Rezension aus Google“ beziehungsweise „Rezension aus MyHammer“.
- Vollständige Texte unverändert übernehmen. Für einen Auszug die Auslassung mit `…` zeigen, `data-review-excerpt="true"` am Artikel setzen und die Kennzeichnung `<span class="google-review-card__excerpt">Auszug</span>` im Quellenbereich behalten. Bei vollständigem Text beide Auszug-Markierungen entfernen.
- Bei einer Bewertung ohne Text das gesamte `<blockquote>…</blockquote>` weglassen. Keinen Ersatztext als vermeintliches Zitat einsetzen.
- Beim direkten Bearbeiten von HTML Sonderzeichen im Rezensionstext korrekt schreiben: `&` als `&amp;`, `<` als `&lt;` und `>` als `&gt;`. Umlaute und Emojis bleiben erhalten; als UTF-8 speichern.

## 4. Anzahl und Pflegestand aktualisieren

Oben im Bewertungsbereich stehen die Gesamtzahl **17** und **13 Google · 4 MyHammer**. Diese drei Zahlen bei Änderungen nachzählen. Der Button nennt derzeit **Weitere 11 Bewertungen ansehen**; das ist die Zahl der Karten im aufklappbaren Raster. Die ersten sechs Karten können unverändert bleiben.

Unten den sichtbaren Pflegestand und das maschinenlesbare Datum gemeinsam anpassen. Beispiel für den 12. November 2026:

```html
<time datetime="2026-11-12">12.11.2026</time>
```

Nur das tatsächliche Datum der Pflege eintragen. Beim späteren Austausch eines Auszugs gegen seinen vollständigen Text bleibt die Anzahl der Rezensionen gleich.

## 5. Änderung prüfen und hochladen

- Die bearbeitete `index.html` zunächst auf der Test-Subdomain ersetzen. Bei reinen Textänderungen bleiben Bilder, CSS und andere Seiten unverändert.
- Desktop und Handy prüfen: Namen und Quellen, Sterne, Textumbrüche, Aufklappen und Zuklappen. Der Bereich funktioniert auch bei deaktiviertem JavaScript.
- Eventuell aktive Hostinger-/CDN-Seitencaches leeren und die Seite neu laden.
- Nach Freigabe die geprüfte Datei in das gewünschte Live-Webroot übernehmen. Die portable Einzeldatei ist eine separate Designvorschau und ersetzt nicht die `index.html` der Website. Eine neue portable Vorschau beziehungsweise vollständige ZIP muss nach späteren Änderungen neu erstellt werden.

## 6. Förderinformationen separat pflegen

Bewertungen und Förderinformationen sind unabhängig. Für Rezensionen ist kein automatischer Job nötig. Die vorhandene Prüfung der Förderquellen bleibt bestehen; sie meldet möglichen Prüfbedarf und schreibt keine neuen Förderregeln selbstständig.

Die fachlichen Rechenregeln und Datumsgrenzen liegen weiterhin in `assets/js/foerder-regeln.js`, der Prüfstatus in `assets/data/foerder-status.json`. Die Anleitung dazu steht in `README-HOSTINGER.md`. Förderdaten erst nach fachlicher Quellenprüfung ändern; das bloße Verschieben eines Datums genügt nicht.
