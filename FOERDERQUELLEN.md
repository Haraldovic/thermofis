# THERMOFIS – Quellenprüfung für den Förderrechner

Prüfdatum: 13.10.2026. Nur amtliche / Primärquellen wurden für die Rechenregeln verwendet. Die geprüften Regeln sind deutlich neuer als die verbreiteten Förderübersichten von 2024/2025. Dieses Dokument beschreibt den überprüften Stand und die Grenzen der Vorschau, keine individuelle Förderzusage.

## Implementierte Wärmepumpenregeln: KfW 458

Für ein privates Einfamilienhaus mit genau einer Wohneinheit wird `min(angenommene förderfähige Bruttoausgaben, 28.000 €) × Förderquote` gerechnet. Grundförderung: 30 %. Klimageschwindigkeitsbonus: 16 % bei bestätigter Selbstnutzung als Haupt-/alleiniger Wohnsitz und förderkonformem Austausch einer funktionierenden Öl-, Kohle-, Gas-Etagen- oder Nachtspeicherheizung; zentrale Gas-/Biomasseheizung erst ab 20 Jahren. Fachgerechter Ausbau/Entsorgung und keine fortgesetzte fossile/gasbetriebene Versorgung werden abgefragt.

Einkommensbonus nach durchschnittlichem zu versteuerndem Haushaltseinkommen: bis 30.000 € → 40 %, bis 40.000 € → 30 %, bis 50.000 € → 10 %. Mindestens ein Kind unter 18 mit Kindergeldberechtigung am Haupt-/alleinigen Wohnsitz erhöht Grenzen einmalig um 10.000 €. Die Gesamtquote ist grundsätzlich auf 70 % begrenzt, bei unterster Einkommensstufe auf 80 %. Ohne Einkommen wird kein Einkommensbonus angenommen. Der alte 5%-Effizienzbonus ist nicht Teil des aktuellen Merkblatts.

Quelle: [KfW 458](https://www.kfw.de/458).

Bei Anträgen 2026 ist der Durchschnitt der zVE aus 2023 und 2024 maßgeblich; relevante Eigentümer und Partner zählen zum Haushalt. Das Gebäude muss einen mindestens fünf Jahre alten Bauantrag/Bauanzeige haben. BzA/technische Mindestanforderungen und Optimierung des Verteilungssystems müssen bestätigt werden. Unbedingter Vertrag bzw. Baubeginn vor Antragstellung schließen grundsätzlich aus; der erforderliche Vertrag mit Förderbedingung geht dem Antrag voraus. Nach Zusage beträgt der Umsetzungszeitraum 36 Monate.

Ab 01.02.2027 sinkt das erste Kostenlimit halbjährlich um 750 €, der Klimabonus um vier Prozentpunkte; ab 01.08.2028 entfällt letzterer. Mehrfamilien-/WEG-Grenzen: erste Wohneinheit 28.000 €, zweite bis sechste je 15.000 €, weitere je 8.000 €; Zuordnung und Zusatzanträge sind gesondert. Diese Fälle führen im Rechner zur Beratung.

Quelle: [Merkblatt 458, Stand 09/2026, gültig 24.09.2026](https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-%28Inlandsf%C3%B6rderung%29/PDF-Dokumente/6000005131_M_458.pdf).

## Fußbodenheizung als Heizungsoptimierung

Der Rechner nimmt ausschließlich die BAFA-Grundförderung 15 % an, maximal auf 30.000 € förderfähige Ausgaben für das unterstützte Einfamilienhaus. Technisch bestätigt werden müssen: erste Flächenheizung, System-Vorlauftemperatur ≤35 °C und hydraulisch abgeglichenes System. Ohne Abgleich ist Verfahren B erforderlich. Wärmeerzeuger muss älter als zwei Jahre sein; fossil nicht älter als zwanzig Jahre. Mindestinvestition 300 € brutto. Der Rechner zeigt keine Förderung bei ungeklärter Technik, bereits verbrauchter einschlägiger Obergrenze oder anderem Förderweg.

Quelle: [Infoblatt förderfähige Maßnahmen, Version 11.0 (09/2026), Abschnitte 4.2.5 und 5.1](https://www.kfw.de/PDF/Download-Center/F%C3%B6rderprogramme-%28Inlandsf%C3%B6rderung%29/PDF-Dokumente/6000004863_Infoblatt_BEG_F%C3%B6rderf%C3%A4hige_Ma%C3%9Fnahmen.pdf). [BAFA Heizungsoptimierung](https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Sanierung_Wohngebaeude/Heizungsoptimierung/heizungsoptimierung_node.html) (Direktabruf 403, amtliche Suchindexauszüge plus vollständig gelesene aktuelle Richtlinie).

Die neue BEG-EM-Richtlinie vom 17.08.2026, veröffentlicht 27.08.2026, enthält entscheidende Änderungen: Der iSFP-Bonus setzt laut Nr. 8.4.2 ein Mindestinvestitionsvolumen von 30.000 € voraus und erhöht nur den oberhalb der regulären Obergrenze liegenden Ausgabenanteil um fünf Prozentpunkte. Deshalb keine pauschale Aussage „20 % mit iSFP“. Die Optimierungsförderung ist auf maximal fünf Wohneinheiten begrenzt. Ausgabenobergrenzen gelten kalenderjährlich gebäudeweit auch über mehrere Anträge. Vorsteuerabzugsberechtigte dürfen nur Nettokosten ansetzen. Für Wärmepumpen sind im ersten Quartal 2027 15 % Basis plus EU-Wertschöpfungsbonus vorgesehen; konkrete Freigabe/Details fehlen noch. Daher sperrt der Rechner WP-Förderzahlen vorsorglich ab 01.01.2027 bis zu einer fachlich geprüften neuen Konfiguration.

Quelle: [BEG EM – amtliche Richtlinie](https://www.bundesanzeiger.de/pub/publication/jLXvW09kHTQoDINAdoC/content/jLXvW09kHTQoDINAdoC/BAnz%20AT%2027.08.2026%20B1.pdf?inline=), besonders Nr. 5.4, 8.2, 8.3, 8.4.1/2/6 sowie TMA 4.1. Nichtamtliche ältere Übersichten widersprechen teilweise diesem Stand und wurden nicht als Rechenquelle genutzt.

## Steuern

§ 35c EStG: Selbst bewohntes Eigentum, älter als zehn Jahre, qualifizierte energetische Maßnahmen durch Fachunternehmen mit amtlicher Bescheinigung; 7 % im Abschlussjahr, 7 % im Folgejahr, 6 % im dritten Jahr, zusammen höchstens 40.000 € pro Objekt. Rechnung und Zahlung auf Leistungserbringerkonto erforderlich. Tatsächlich nutzbare Ermäßigung hängt von der Einkommensteuer ab; keine parallele Berücksichtigung derselben Maßnahme nach §35a oder mit öffentlicher Förderung.

Quelle: [§35c EStG](https://www.gesetze-im-internet.de/estg/__35c.html), erfolgreich vollständig gelesen über URL mit Query-Parameter; .

§35a EStG: Handwerkerleistungen für Renovierung/Erhaltung/Modernisierung: 20 % der Arbeitskosten, maximal 1.200 € jährlich, Rechnung und unbare Zahlung, Ausschluss öffentlich geförderter Maßnahmen mit zinsverbilligtem Darlehen/steuerfreiem Zuschuss. Keine pauschalen 20 % der vollständigen Material-/Montagerechnung ansetzen.

Quelle: [§35a EStG](https://www.gesetze-im-internet.de/estg/__35a.html) (vollständiger amtlicher Suchindextext; Direktabruf Timeout).

Übliche steuerpflichtige Heizungs-/Sanitärleistungen unterliegen 19 % USt.; der PV-Nullsteuersatz ist keine allgemeine Wärmepumpensteuerbefreiung. Im Privatkundenszenario wird Bruttopreis angesetzt, Umsatzsteuer ist enthalten und wird nicht zusätzlich addiert.

Quelle: [§12 UStG](https://www.gesetze-im-internet.de/ustg_1980/__12.html).

## Hanau / Hessen / Main-Kinzig-Kreis

Keine nicht bestätigten regionalen Zuschüsse in Zahlen eingerechnet. Das Fehlen einer gefundenen Zusatzförderung ist kein Nachweis, dass es keine gibt. Die Stadt bietet Förderportale/Energieberatung an; ihre amtliche Wärmepumpenseite bestätigt ebenfalls die Einzelfallabhängigkeit. Örtliche Anschlussentscheidungen und Wärmeplanung sind vor Anlagenwahl zu prüfen.

Amtliche Anlaufstellen: [Hanau Wärmepumpen](https://www.hanau.de/umwelt/klimaundenergie/waermepumpen/index.html) (`turn30search1`), [Hanau Energieberatung](https://www.hanau.de/stadtentwicklung/energie_klima/energieberatung/index.html) (`turn30search5`), [kommunale Wärmeplanung](https://www.hanau.de/umwelt/klimaundenergie/kommunalewaermeplanung/index.html) (`turn30search0`), [MKK Klimaschutz](https://www.mkk.de/klimaschutz.html) (`turn30search6`). Hessens kommunales Energieprogramm meldet seit 01.06.2026 Antragsstopp und richtet sich an Kommunen, nicht als pauschaler Privatkundenzuschuss verwenden: [WIBank](https://www.wibank.de/wibank/energieeffizienz-und-erneuerbare-energien/foerderung-energieeffizienz-und-nutzung-erneuerbarer-energien-307140) (`turn24search3`).

## Grenzen und Wartung der Umsetzung

32.000 € WP-Budget und 100 €/m² FBH sind frei editierbare illustrative Annahmen, keine verifizierten Marktpreise und keine THERMOFIS-Preisliste. Keine Heizlast aus Wohnfläche, keine vermeintlich exakte Dimensionierung, Betriebs-/Amortisationsrechnung oder reale Förderzusage. Unterstützte Förderung nur privates 1-WE-Bestands-EFH ohne Vorsteuerabzug. Einkommen bleibt lokal und wird nicht an den Mailto-Entwurf übergeben.

`foerder-regeln.js`: Version/checkedAt 2026-10-13, reviewDue 2026-11-12, validUntil 2027-01-31; WP zusätzlich ab Jahreswechsel gesperrt. Mehr als 30 Tage ohne neue Prüfung sperrt Zahlen. Optionales `/assets/data/foerder-status.json` blockiert bei `needs-review`/`unavailable`; `checked` verlangt schemaVersion1 und ein geprüftes Datum. Fehlende Konfiguration wird transparent benannt. Änderungserkennung darf Regeln nicht automatisch fachlich freigeben. Die Tests in `test-calculator.cjs` prüfen Grenzwerte, Boni, Basis-/Kostenquoten, technische Bedingungen und sämtliche Sperrpfade.
