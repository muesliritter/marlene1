# Freiburg for Marlene

Ein persönlicher, zweisprachiger Freiburg-Guide: 13 Cafés, 6 Bäckereien und eine zusätzliche Lunch-Auswahl aus 3 der Cafés. Alle Beschreibungen und Kaffee-Wertungen stammen aus der gelieferten Liste, nicht aus aktuellen Google-Bewertungen. Öffnungszeiten werden nicht behauptet.

## Schnell zu GitHub und CloudCannon

1. Auf GitHub ein **privates**, leeres Repository `freiburg-for-marlene` anlegen und den Inhalt dieses Ordners hochladen. Die versteckte Datei `.cloudcannon/initial-site-settings.json` muss mit hinein. Bei Nutzung von GitHub Desktop den gesamten Ordner als Repository hinzufügen und privat veröffentlichen.
2. In CloudCannon eine neue Site erstellen, GitHub verbinden und dieses Repository samt Branch auswählen.
3. Die mitgelieferte Konfiguration übernimmt den Build. Falls CloudCannon nachfragt: **Custom SSG**, Build `node build.mjs`, Ausgabeordner **dist**, Node **22**, kein Installationsbefehl. Anschließend die bereitgestellte Testing Domain öffnen und optional die eigene Domain verbinden.

Ein privates GitHub-Repository macht die gehostete Website nicht automatisch privat. Falls nur Marlene Zugriff erhalten soll, den Zugriff auf der Hosting-Seite separat einstellen.

Offizielle Konfigurationsreferenz: https://cloudcannon.com/documentation/developer-articles/configure-your-initial-site-settings/

## Lokal ansehen

Node.js ab Version 20 installieren. Im Projektordner:

```sh
npm run build
npm start
```

Danach http://127.0.0.1:4173 öffnen. Keine Paketinstallation erforderlich. `dist` ist das fertig gebaute Ergebnis, nicht die Inhaltsquelle. Die ZIP enthält eine gebaute Kopie zur einfachen Übergabe; Git ignoriert dist, CloudCannon erzeugt es selbst.

## Inhalte und Erweiterung

- `content/places.json`: Einträge, Kategorien und vollständige Texte unter `de` und `en`.
- `site/style.css`: Farben, Schriften, Layout, mobile Darstellung.
- `site/app.js`: Texte der Oberfläche, Filter und Galerien.
- `site/assets/freiburg.svg`: eigens erstellte, stilisierte Illustration, kein Ortsfoto.
- `content/settings.json`: optionaler eingeschränkter Google-Maps-Browser-Key.

Routen: `/de/`, `/en/`, darunter jeweils `cafes/`, `bakeries/`, `restaurants/`. Weitere Einträge können in die JSON-Liste aufgenommen werden. Neue Kategorien in `app.js` und `build.mjs` ergänzen. Die CloudCannon-Konfiguration ist auf unkompliziertes Hosting ausgelegt; Inhalte werden vorerst in JSON bearbeitet, ein individuelles redaktionelles Formular ist nicht eingerichtet.

Die Merkliste bleibt nur im Browser gespeichert. Der Sprachwechsel erhält die Kategorie. Suchtext und Stadtteilfilter werden beim Seitenwechsel zurückgesetzt. Google Fonts werden extern geladen; bei Nichterreichbarkeit greifen lokale Serif-/Sans-Serif-Ersatzschriften.

## Bildergalerien vorbereiten und aktivieren

Wie vereinbart sind **keine Google-Fotos importiert**. Ohne Key zeigt jede Karte eine grafische Fläche und einen Link zu Fotos des Orts auf Google Maps. Die Gestaltung gibt keine fremden oder erfundenen Bilder als Ortsfotos aus.

Für Google-Fotos:

1. Im Google-Cloud-Projekt Abrechnung, Maps JavaScript API und Places API (New) aktivieren.
2. Einen **Browser-Key** erstellen, auf die tatsächlichen Website-Domains (HTTP-Referrer) und benötigten APIs beschränken; Quoten und Budgetbenachrichtigungen festlegen. Dieser Key wird im Browser sichtbar. Niemals einen geheimen Server-Key einsetzen.
3. In `content/settings.json` das Feld `googleMapsBrowserKey` befüllen.
4. Empfohlen: In jedem Ort `placeId` mit der geprüften Google Place ID befüllen. Ohne ID sucht die Integration nach Name und Adresse und nimmt den ersten Treffer. Vor Live-Nutzung die Zuordnung kontrollieren.
5. Neu bauen / committen. Die Schaltfläche „5 Google-Fotos laden“ lädt auf Wunsch bis zu fünf verfügbare Fotos. Eine von Google garantierte „Top-5“-Rangfolge gibt es hier nicht. Weniger verfügbare Fotos werden als solche angezeigt.

Die Bilder werden erst nach Klick abgerufen. Google-Fotonamen und Fotos werden nicht im Repository oder dauerhaften Browserspeicher zwischengespeichert. Die vergrößerte Ansicht zeigt Autorenlinks und einen Link zur Quelle. Die Live-Integration konnte ohne Key nicht gegen Google getestet werden; API-Freischaltung, Kontingent und regionale Verfügbarkeit bleiben Voraussetzungen.

Dokumentation: https://developers.google.com/maps/documentation/javascript/place-photos

Alternativ eigene/freigegebene Bilder unter `site/assets/uploads/` ablegen und pro Ort bis zu fünf Elemente in `photos` ergänzen:

```json
{
  "url": "/assets/uploads/beispiel.jpg",
  "alt": "Beschreibung des tatsächlichen Ortsfotos",
  "authors": [{"name": "Fotograf/in", "url": "https://example.com"}],
  "source": "https://example.com/original"
}
```

Für eigene Fotos keine `google: true` Kennzeichnung verwenden. Galerie mit Lightbox, Vor-/Zurück-Steuerung, Pfeiltasten und Escape ist bereits enthalten.

## Übergabestand

Lokales Website-Projekt und CloudCannon-Konfiguration fertig. Kein GitHub-Repository angelegt und keine CloudCannon-Veröffentlichung erfolgt: Konto-Verbindungen liegen in diesem Chat noch nicht vor. Google-Galerien auf Wunsch vorbereitet, nicht aktiviert.

## Geprüft

Build und JavaScript-Syntax erfolgreich. Automatischer Chrome-Test: 19 Einträge, Suche nach Birnengebäck, Stadtteil Wiehre, Speichern und Merkliste, englische Bäckereiseite mit 6 Einträgen, Lunch-Seite mit 3 Einträgen, mobile Breite 390 px ohne horizontalen Überlauf und keine JavaScript-Laufzeitfehler. Desktop- und Mobil-Screenshots visuell geprüft. Live-Google-Aufrufe sowie der tatsächliche CloudCannon-Build sind mangels Konto-/API-Verbindung nicht geprüft.
