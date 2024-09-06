# AV Announcement Generator

Der **AV Announcement Generator** ist ein einfach zu bedienendes Tool, mit dem du Ankündigungen für AV Cubes direkt auf deinem Computer oder Smartphone erstellen kannst.

## Funktionen

- **Manuelle Eingabe**: Trage einfach die nötigen Informationen in die Felder ein.
- **Automatische Befüllung**: Gib den Link eines AnimalRightsCalendar-Events ein, und die Felder werden automatisch befüllt.
- **Vorschau und Download**: Sieh dir die fertige Ankündigung als Vorschau an oder lade sie direkt als Bilddatei herunter.
- **Standardwerte speichern**: Du kannst häufig verwendete Daten wie den Veranstaltungsort als Standardwerte speichern, um sie nicht jedes Mal neu eingeben zu müssen.
- **Smartphone-Kompatibilität**: Die Anwendung funktioniert nicht nur auf Computern, sondern auch auf Smartphones, sodass du die Ankündigungen bequem unterwegs erstellen kannst.

## Anleitung

### 1. Manuelle Eingabe

1. Öffne die Datei `index.html` in deinem Webbrowser (z.B. Chrome, Firefox, Safari).
2. Du siehst vier Felder:
   - **Chapter**: Trage das Chapter ein.
   - **Datum**: Gib das Datum der Cubes ein.
   - **Zeit**: Gib die Start- und Endzeit des Cubes ein.
   - **Veranstaltungsort**: Gib den Ort der Veranstaltung ein.
3. Klicke auf **Vorschau**, um die Ankündigung anzuzeigen.
4. Klicke auf **Download**, um die Ankündigung als Bilddatei herunterzuladen.

### 2. Automatische Befüllung der Felder

## Wichtig

- Da die Anwendung lokal ausgeführt wird und nicht auf einem Server, blockieren die meisten Webseiten den Zugriff auf ihre Daten. Um dieses Problem zu umgehen, gibt es Dienste, die die Anfrage über ihre Server umleiten und so den Zugriff ermöglichen. Auch der ARC blockiert Anfragen von lokalen Maschinen.
- Um diese Einschränkung zu umgehen, besuche die Webseite **[cors-anywhere.herokuapp.com/corsdemo](https://cors-anywhere.herokuapp.com/corsdemo)** und klicke auf **Request temporary access to the demo server*. Dadurch erhältst du vorübergehend die Möglichkeit, Daten vom ARC abzufragen.

## Vorgehen

1. Kopiere den Link eines Events von der Website [**AnimalRightsCalendar**](https://animalrightscalendar.org/).
2. Klicke auf **Aus ARC füllen**.
3. Füge diesen Link in das Feld "ARC Event-Link" ein.
4. Klicke auf **Füllen** – die Felder werden automatisch mit den Informationen aus dem Event befüllt.

### 3. Standardwerte anpassen

1. Öffne die Datei **app.js** unter dem Ordner **js** in einem Texteditor (z.B. Notepad oder einem beliebigen einfachen Editor).
2. Ganz oben in der Datei findest du die Standardwerte, die bereits vorausgefüllt sind:

```javascript
const defaultSettings = {
    chapter: 'Magdeburg',
    twoLines: false,
    date: '01. Januar 2024',
    time: '14:00 - 18:00 Uhr',
    place: 'Willy-Brandt-Platz'
};
```

3. Ändere diese Werte nach deinen Wünschen, z.B. wenn du oft das gleiche Chapter, die gleiche Uhrzeit oder den gleichen Ort verwendest.
4. Diese Standardwerte werden dann automatisch in die entsprechenden Felder eingetragen, wenn sie leer bleiben. So musst du nur das Datum ändern, falls die anderen Felder immer gleich bleiben.

### 4. Einzigartige Dateibenennung

- Wenn du eine Ankündigung herunterlädst, wird sie automatisch mit einem einzigartigen Dateinamen gespeichert, der Informationen wie den Veranstaltungsort und das Datum enthält. So werden keine Dateien überschrieben und die Ankündigungen können einfacher gefunden werden.

## Kompatibilität

- Der **AV Announcement Generator** funktioniert sowohl auf **Computern** als auch auf **Smartphones**. Du kannst die Anwendung in deinem Webbrowser öffnen und bequem auch von unterwegs Ankündigungen erstellen und herunterladen.

## Voraussetzungen

- Du benötigst keine speziellen Programme oder Server.
- Öffne einfach die Datei `index.html` in einem Webbrowser auf deinem Computer oder Smartphone, und schon kannst du loslegen.
