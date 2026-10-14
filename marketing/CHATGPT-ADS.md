# Thermofis: ChatGPT-Werbung und organische Sichtbarkeit

Recherche: 13.10.2026. Nur offizielle OpenAI-Quellen für ChatGPT-Angaben, offizielle Google-Quellen für die lokale Alternative. Keine Anmeldung, Kampagne, Zahlung, Einladung oder externe Nachricht vorgenommen.

## Verifizierter Stand

**Ja: In Deutschland können Unternehmen aktuell ChatGPT-Werbung selbst buchen.** Die aktuelle Länder-Tabelle führt Germany mit „Available“ auf. Die offizielle Europameldung wurde am 31.08.2026 um die Verfügbarkeit des Self-Service-Ads-Managers ergänzt. Die frühere Aussage „nur US-Pilot/Warteliste“ wäre damit überholt.

- Länder-Tabelle: https://help.openai.com/en/articles/20001245-ads-manager-availability
- Meldung: https://openai.com/index/chatgpt-ads-expands-across-europe/
- Einstieg: https://ads.openai.com/

**Eine bezahlte Anzeige kauft keine Empfehlung im normalen ChatGPT-Antworttext.** Anzeigen sind gekennzeichnete, getrennte Platzierungen. Ads beeinflussen Antworten oder deren Reihenfolge nicht. Sie erreichen Free-/Go-Nutzer, die übrigen genannten Bezahl- und Geschäftstarife haben keine Werbung.

Quelle: https://help.openai.com/en/articles/20001047-ads-in-chatgpt

## Einrichtung für den Kunden

1. Kunde eröffnet bei https://ads.openai.com/ ein eigenes Werbekonto mit seinen Unternehmensdaten. Harun kann später als Nutzer eingeladen werden; kein geteiltes Passwort.
2. Land, Währung EUR und Zeitzone Europe/Berlin beim Erstellen korrekt wählen. Diese Kontoeinstellungen sind laut Hilfe danach nicht änderbar. Logo, rechtlicher Unternehmensname, Verifikation und Rechnungsdaten vervollständigen.
3. Die direkte Kontoerstellung ohne Anzeigenanlage wählen, solange die Kampagne noch nicht startbereit ist. Während der Anmeldung angelegte Anzeigen können nach Freigabe und vollständiger Einrichtung bereits ausliefern und Kosten verursachen.
4. Eine Dienstleistungskampagne mit Ziel Klicks beginnen. Im Ads Manager tatsächliche unterstützte Orte suchen: Hanau und Einzugsgebiet. Städte/Regionen/PLZ sind je nach Land und Konto verfügbar; eine belastbare Zusage, dass Hanau oder jeder gewünschte Ort auswählbar ist, geben die öffentlichen Quellen nicht. Wenn nur Deutschland oder ein zu großer Bereich angeboten wird, vorerst nicht starten.
5. Zwei Anzeigenvarianten auf die passende Leistungsseite führen, z. B. Wärmepumpe und Fußbodenheizung, jeweils mit Rechner und klarer Beratungsanfrage. Kontexthinweise erklären das Projekt, sind keine klassischen exakt passenden Suchkeywords und ersetzen geografische Einschränkungen nicht.
6. Qualifizierte Anfragen und Termine auswerten, nicht nur Klicks. Eine Telefon-/WhatsApp-Schaltfläche zu klicken ist noch keine tatsächliche Kundenanfrage.

Quellen: Kontoeinrichtung https://help.openai.com/en/articles/20001213-ads-manager-account-setup; Kampagnen https://help.openai.com/en/articles/20001210-create-campaigns-for-chatgpt-ads; technische Kontexthinweise https://developers.openai.com/ads/campaign-targeting.

## Budget und Empfehlung

**Offizielle Zahl:** Das aktuelle Mindesttagesbudget für EUR-Konten beträgt **15 EUR**. Das ist ein Kampagnenbudget, kein Preis pro Klick und keine garantierte Erfolgszahl. Das Tagesbudget ist ein Durchschnitt über die Budgetwoche; einzelne Tage dürfen bis zum Doppelten ausgeben. Für ein festes gesamtes Testlimit ist ein Kampagnengesamtbudget strenger. Preise und notwendiges Gesamtbudget nicht aus USD-Beispielen in Entwicklerdokumenten ableiten.

Quelle: Kampagnenhilfe, Zeilen 40–49, 125–135. Die öffentl. Quellen nennen keinen festen branchenbezogenen CPC für SHK Hanau.

**Meine Empfehlung, keine offizielle OpenAI-Leistungsaussage:** Zuerst die mobile Website fertigstellen, echte Rezensionen und die Beratungsstrecke verbinden. Bei sehr knappem Budget einen klar begrenzten lokalen Google-Suchkampagnen-Test priorisieren; ChatGPT zunächst als zusätzlichen Lernkanal betrachten. Falls ein ausreichend enger ChatGPT-Standortfilter verfügbar ist, einen 14-tägigen Test mit einem vorab abgestimmten Gesamtlimit von ungefähr 210–300 EUR prüfen. Das ist ein vorgeschlagener Testumfang, keine Plattform-Mindestgesamtausgabe, keine Preisprognose und kein Nachweis für rentable Aufträge. Wenn das Konto das Gesamtlimit in dieser Höhe nicht akzeptiert, nicht stillschweigend erhöhen.

Google-Option: nur reales Einsatzgebiet ansprechen, passende Leistungsbegriffe wie „Wärmepumpe installieren Hanau“ oder „Fußbodenheizung nachrüsten Hanau“, irrelevante Ausbildungs-/DIY-Suchen ausschließen, Standortoption **Präsenz: Personen in oder regelmäßig in den Zielregionen** wählen. Google bestätigt diese Option zur Reduktion auswärtiger Klicks: https://support.google.com/google-ads/answer/9376662?hl=en. Die bessere Priorisierung für Thermofis ist meine Einschätzung, kein Quellenbeweis über höhere Rentabilität.

## Organisch in ChatGPT gefunden werden

Offiziell empfiehlt OpenAI, OAI-SearchBot in robots.txt und Hosting/Firewall zuzulassen. Die Sichtbarkeit und Platzierung ist trotzdem nicht garantiert. GPTBot ist separat für mögliche Modelltrainings; dessen Freigabe ist für Search nicht nötig. Für bezahlte Kampagnen muss zusätzlich OAI-AdsBot die Zielseite prüfen können.

Quellen: https://developers.openai.com/api/docs/bots; https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt.

Meine Umsetzungsempfehlung: verständliche, echte Leistungsinformationen direkt im HTML, korrekte Unternehmens-/Kontaktdaten und Einsatzgebiete, saubere Sitemap, kurze aktuelle FAQ mit nachvollziehbaren Förderquellen und echten Projekten. 3D-Szenen immer mit lesbarer Erklärung begleiten, damit Menschen und Suchsysteme Inhalte auch ohne WebGL verstehen. Strukturierte Daten helfen bei sauberer Maschinenlesbarkeit, stellen aber keine garantierte ChatGPT-Aufnahme dar. Kein bezahltes „Platz 1 in ChatGPT“-Versprechen geben.

Für Google bestätigt die eigene Hilfe, dass vollständige Unternehmensdaten sowie Rezensionen eine Rolle bei lokalen Ergebnissen spielen; eine bessere organische Position kann auch dort nicht gekauft werden: https://support.google.com/business/answer/7091?hl=de.

## Knapp verwendbarer Antwortbaustein

„Ja, ChatGPT-Werbung geht inzwischen auch in Deutschland direkt über ads.openai.com. Der EUR-Mindesttagesetat liegt aktuell bei 15 €. Für Thermofis würde ich zuerst mobile Nutzer sauber zur Beratungsanfrage führen und dann einen kleinen, regional begrenzten Test machen. Wichtig: Eine Anzeige ist keine gekaufte Empfehlung in meiner normalen Antwort. Organisch helfen zugängliche, klare Informationen über Thermofis; eine garantierte Platzierung gibt es nicht.“


