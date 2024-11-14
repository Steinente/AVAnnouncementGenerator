GERMAN:

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

1. Öffne die Webseite **[AVAnnouncementGenerator](https://steinente.github.io/AVAnnouncementGenerator/)**.
2. Du siehst fünf Felder:
   - **Chapter**: Trage das Chapter ein.
   - **Chapter zweizeilig**: Wähle aus, ob das Chapter in zwei Zeilen geschrieben werden soll.
   - **Datum**: Gib das Datum der Cubes ein.
   - **Zeit**: Gib die Start- und Endzeit des Cubes ein.
   - **Veranstaltungsort**: Gib den Ort der Veranstaltung ein.
3. Klicke auf **Vorschau**, um die Ankündigung anzuzeigen.
4. Klicke auf **Download**, um die Ankündigung als Bilddatei herunterzuladen.

### 2. Automatische Befüllung der Felder

1. Kopiere den Link eines Events von der Website [**AnimalRightsCalendar**](https://animalrightscalendar.org/).
2. Klicke auf **Aus ARC füllen**.
3. Füge diesen Link in das Feld "ARC Event-Link" ein.
4. Klicke auf **Füllen** – die Felder werden automatisch mit den Informationen aus dem Event befüllt.

### 3. Standardwerte anpassen

1. Trage einen Wert in eines der Felder ein.
2. Rechts neben dem Feld befindet sich ein Speichern-Symbol - wenn du darauf klickst, speicherst du den aktuellen Wert als Standardwert.
3. Diese Standardwerte werden dann als Platzhalter in die entsprechenden Felder eingetragen. Bei der Vorschau und dem Download werden, falls die Felder nicht befüllt wurden, die Platzhalter verwendet. So musst du nur das Datum ändern, falls die anderen Felder immer gleich bleiben.

### 4. Einzigartige Dateibenennung

- Wenn du eine Ankündigung herunterlädst, wird sie automatisch mit einem einzigartigen Dateinamen gespeichert, der Informationen wie den Veranstaltungsort und das Datum enthält. So werden keine Dateien überschrieben und die Ankündigungen können einfacher gefunden werden.

## Kompatibilität

- Der **AV Announcement Generator** funktioniert sowohl auf **Computern** als auch auf **Smartphones**. Du kannst die Anwendung in deinem Webbrowser öffnen und bequem auch von unterwegs Ankündigungen erstellen und herunterladen.

## Voraussetzungen

- Du benötigst keine speziellen Programme oder Server.

## Lokale Ausführung (Nur für Nerds)

- Wenn die Anwendung lokal ausgeführt wird und nicht auf einem Server, blockieren die meisten Webseiten den Zugriff auf ihre Daten. Um dieses Problem zu umgehen, gibt es Dienste, die die Anfrage über ihre Server umleiten und so den Zugriff ermöglichen. Auch der ARC blockiert Anfragen von lokalen Maschinen.
- Um diese Einschränkung zu umgehen, besuche die Webseite **[cors-anywhere.herokuapp.com/corsdemo](https://cors-anywhere.herokuapp.com/corsdemo)** und klicke auf **Request temporary access to the demo server*. Dadurch erhältst du vorübergehend die Möglichkeit, Daten vom ARC abzufragen.

-----------------------------------------------
ENGLISH:

# AV Announcement Generator

The **AV Announcement Generator** is an easy-to-use tool that allows you to create announcements for AV Cubes directly on your computer or smartphone.

## Features

- **Manual Entry**: Simply enter the necessary information in the fields.
- **Auto-fill**: Enter the link of an AnimalRightsCalendar event, and the fields will be filled in automatically.
- **Preview and Download**: View the completed announcement as a preview or download it directly as an image file.
- **Save Default Values**: You can save frequently used data, like the location, as default values, so you don’t have to enter them every time.
- **Smartphone Compatibility**: The application works not only on computers but also on smartphones, so you can conveniently create announcements on the go.

## Instructions

### 1. Manual Entry

1. Open the website **[AVAnnouncementGenerator](https://steinente.github.io/AVAnnouncementGenerator/)**.
2. You will see five fields:
   - **Chapter**: Enter the chapter.
   - **Two-line Chapter**: Choose if the chapter should be displayed in two lines.
   - **Date**: Enter the date of the Cubes.
   - **Time**: Enter the start and end times of the Cubes.
   - **Location**: Enter the location of the event.
3. Click **Preview** to display the announcement.
4. Click **Download** to download the announcement as an image file.

### 2. Auto-fill Fields

1. Copy the link of an event from the **[AnimalRightsCalendar](https://animalrightscalendar.org/)** website.
2. Click **Fill from ARC**.
3. Paste this link into the “ARC Event Link” field.
4. Click **Fill** – the fields will automatically populate with the event’s information.

### 3. Customize Default Values

1. Enter a value in one of the fields.
2. To the right of the field, there is a save icon – click it to save the current value as a default.
3. These default values will then be displayed as placeholders in the corresponding fields. If the fields are left unfilled, the placeholders will be used in the preview and download. This way, you only need to change the date if the other fields remain the same.

### 4. Unique File Naming

- When you download an announcement, it is automatically saved with a unique filename that includes information like the location and date. This prevents files from being overwritten and makes announcements easier to find.

## Compatibility

- The **AV Announcement Generator** works on both **computers** and **smartphones**. You can open the application in your web browser and conveniently create and download announcements from anywhere.

## Requirements

- No special programs or servers are needed.

## Local Execution (For Nerds Only)

- When running the application locally, most websites block access to their data. To bypass this, some services route requests through their servers to allow access. ARC also blocks requests from local machines.
- To bypass this restriction, visit **[cors-anywhere.herokuapp.com/corsdemo](https://cors-anywhere.herokuapp.com/corsdemo)** and click on **Request temporary access to the demo server**. This grants temporary access to query data from ARC.
