// lift-ts/sim.ts
// Einzeilige Deno-Simulation für einen Aufzug mit JSON-Persistenz für Calls/Requests.
// Ausführen mit:
// deno run --allow-read --allow-write lift-ts/sim.ts

// ---------------------- Types & Enums ----------------------
// Definiert einen 'Floor' als Zahl (z.B. 0,1,2)
type Floor = number;

// Richtung, in die sich der Aufzug bewegen kann
enum Direction {
  Up = 'up', // aufwärts
  Down = 'down', // abwärts
  None = 'none' // keine Bewegung
}

// Zustand der Türen
enum DoorState {
  Open = 'open', // Türen offen
  Closed = 'closed' // Türen geschlossen
}

// Repräsentiert einen externen Ruf (Stockwerk + gewünschte Richtung)
interface Call {
  floor: Floor; // Etage, von der gerufen wird
  direction: Direction.Up | Direction.Down; // gewünschte Fahrtrichtung
}

// Interne Anfrage aus dem Aufzug (Passagier drückt Knopf)
interface Request {
  floor: Floor; // gewünschte Ziel-Etage
}

// ---------------------- Einfacher JSON-Speicher (Deno) ----------------------
// Speichert und lädt die ausstehenden Calls/Targets in `lift-ts/lift-data.json`.
// Import der Delay-Hilfe aus der Deno Standardbibliothek
import { delay } from "https://deno.land/std@0.201.0/async/delay.ts";
// Pfad zur JSON-Datei für persistente Daten
const DATA_FILE = `${Deno.cwd()}/lift-ts/lift-data.json`;

// Lädt die gespeicherten Daten (falls vorhanden). Gibt ein leeres Objekt zurück,
// wenn die Datei nicht existiert oder nicht gelesen werden kann.
// Lädt JSON-Datei mit gespeicherten Calls/Targets, falls vorhanden
async function loadData(): Promise<{ calls?: Call[]; targets?: number[] }> {
  try {
    const raw = await Deno.readTextFile(DATA_FILE); // Dateiinhalt lesen
    return JSON.parse(raw) as { calls?: Call[]; targets?: number[] }; // JSON parsen
  } catch (_err) {
    return {}; // Bei Fehler (z.B. Datei fehlt) leeres Objekt zurück
  }
}

// Speichert die aktuellen Calls/Targets in einer JSON-Datei (lesbar formatiert).
// Speichert Calls/Targets in lesbarer JSON-Datei
async function saveData(data: { calls?: Call[]; targets?: number[] }) {
  try {
    // Versuche, das Verzeichnis zu erstellen (falls noch nicht vorhanden)
    await Deno.mkdir(`${Deno.cwd()}/lift-ts`, { recursive: true });
  } catch {}
  // Schreibe die JSON-Datei (2 Leerzeichen Einrückung für Lesbarkeit)
  await Deno.writeTextFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// ---------------------- Lift implementation ----------------------
// ---------------------- Klasse Lift ----------------------
// Modelliert Zustand und Verhalten eines einzelnen Aufzugs.
// Klasse Lift: Zustand (Felder) und Verhalten (Methoden)
class Lift {
  id: string; // Identifikator des Aufzugs
  currentFloor: Floor; // aktuelle Etage
  targetFloors: Set<Floor> = new Set(); // interne Zieltasten
  calls: Call[] = []; // externe Rufe (Etage + Richtung)
  direction: Direction = Direction.None; // aktuelle Fahrtrichtung
  doors: DoorState = DoorState.Closed; // Türzustand
  minFloor: Floor; // unterste Etage
  maxFloor: Floor; // oberste Etage

  // Konstruktor: initialisiert ID und Etagenbereich
  constructor(id: string, minFloor = 0, maxFloor = 10) {
    this.id = id; // Aufzugsname
    this.currentFloor = minFloor; // Starte unten
    this.minFloor = minFloor; // Setze Minimum
    this.maxFloor = maxFloor; // Setze Maximum
  }

  // Interne Anforderung: Fahrgast drückt im Aufzug die Ziel-Etage
  request(req: Request) {
    if (req.floor < this.minFloor || req.floor > this.maxFloor) return; // ungültig
    this.targetFloors.add(req.floor); // Ziel speichern
    this.updateDirection(); // Richtung ggf. anpassen
  }

  // Externer Ruf von einer Etage (Richtung Up/Down)
  call(call: Call) {
    if (call.floor < this.minFloor || call.floor > this.maxFloor) return; // ungültig
    // Vermeide doppelte identische Calls
    if (!this.calls.some(c => c.floor === call.floor && c.direction === call.direction)) {
      this.calls.push(call); // Call speichern
    }
    this.updateDirection(); // Richtung ggf. anpassen
  }

  // Schrittweise Simulation mit realistischen Wartezeiten
  async step() {
    const MOVE_TIME = 3000; // 3 Sekunden pro Stockwerk
    const DOOR_OP_TIME = 1000; // 1 Sekunde Tür öffnen/schließen
    const DOOR_DWELL = 0; // Zeit, wie lange Türen offen bleiben (ms)

    // Wenn Türen offen sind: schließe sie und beende diesen Schritt
    if (this.doors === DoorState.Open) {
      console.log('Türen schließen...');
      await delay(DOOR_OP_TIME); // warte
      this.doors = DoorState.Closed; // markiere geschlossen
      return; // kein Weiterfahren in diesem Schritt
    }

    // Wenn keine Ziele vorhanden: idlen
    if (this.targetFloors.size === 0 && this.calls.length === 0) {
      this.direction = Direction.None; // keine Bewegung
      return; // nichts zu tun
    }

    this.updateDirection(); // Richtung prüfen/setzen

    // Wenn noch keine Richtung gesetzt: nächstes Ziel wählen
    if (this.direction === Direction.None) {
      this.pickNearest();
      return; // warte bis nächster Schritt
    }

    // Fahre ein Stockwerk in die aktuelle Richtung (dauert MOVE_TIME)
    console.log(`Fahre ${this.direction} eine Etage... (${MOVE_TIME}ms)`);
    await delay(MOVE_TIME); // Simuliere Fahrzeit
    if (this.direction === Direction.Up) {
      if (this.currentFloor < this.maxFloor) this.currentFloor++; // eine Etage hoch
    } else if (this.direction === Direction.Down) {
      if (this.currentFloor > this.minFloor) this.currentFloor--; // eine Etage runter
    }

    // Angekommen: prüfen, ob wir anhalten und Türen öffnen sollen
    const arrived = this.currentFloor; // aktuelle Etage
    let opened = false; // ob Türen geöffnet werden sollen

    if (this.targetFloors.has(arrived)) {
      this.targetFloors.delete(arrived); // internes Ziel erfüllt
      opened = true; // Türen auf
    }

    // Externe Calls nur erfüllen, wenn Richtung passt (oder Lift idle war)
    const callsHere = this.calls.filter(c => c.floor === arrived && (c.direction === this.direction || this.direction === Direction.None));
    if (callsHere.length > 0) {
      // Entferne alle passenden Calls an dieser Etage
      this.calls = this.calls.filter(c => !(c.floor === arrived && (c.direction === this.direction || this.direction === Direction.None)));
      opened = true; // Türen auf
    }

    if (opened) {
      // Öffne die Türen (dauer DOOR_OP_TIME)
      console.log('Türen öffnen...');
      await delay(DOOR_OP_TIME);
      this.doors = DoorState.Open; // Zustand aktualisieren
      if (DOOR_DWELL > 0) await delay(DOOR_DWELL); // optional warten
      // Die Türen werden beim nächsten Schritt geschlossen (siehe oben)
    }

    this.updateDirection(); // Richtung für nächsten Schritt anpassen
  }

  // Wähle die nächstgelegene Etage unter allen Zielen
  pickNearest() {
    const allTargets = new Set<number>([...Array.from(this.targetFloors), ...this.calls.map(c => c.floor)]); // alle Ziele
    if (allTargets.size === 0) return; // nichts zu tun
    let nearest: number | null = null; // nächstes Ziel
    let bestDist = Infinity; // beste Entfernung
    for (const f of allTargets) {
      const d = Math.abs(f - this.currentFloor); // Distanz berechnen
      if (d < bestDist) {
        bestDist = d; // neue beste Distanz
        nearest = f; // nächstes Ziel merken
      }
    }
    if (nearest === null) return; // Sicherheitscheck
    // Richtung setzen basierend auf relativer Position
    this.direction = nearest > this.currentFloor ? Direction.Up : (nearest < this.currentFloor ? Direction.Down : Direction.None);
  }

  // Aktualisiert die Fahrtrichtung, wenn nötig
  updateDirection() {
    if (this.targetFloors.size === 0 && this.calls.length === 0) {
      this.direction = Direction.None; // keine Ziele
      return;
    }

    // Wenn schon in einer Richtung unterwegs und noch Ziele in dieser Richtung existieren, weiterfahren
    if (this.direction === Direction.Up) {
      for (const f of this.targetFloors) if (f > this.currentFloor) return; // noch Ziele oben
      for (const c of this.calls) if (c.floor > this.currentFloor) return; // noch Calls oben
    }
    if (this.direction === Direction.Down) {
      for (const f of this.targetFloors) if (f < this.currentFloor) return; // noch Ziele unten
      for (const c of this.calls) if (c.floor < this.currentFloor) return; // noch Calls unten
    }

    this.pickNearest(); // sonst Richtung zum nächsten Ziel setzen
  }

  // Status als einfaches Objekt zurückgeben (für Logging/Debug)
  status() {
    return {
      id: this.id, // Aufzugs-ID
      floor: this.currentFloor, // aktuelle Etage
      direction: this.direction, // Fahrtrichtung
      doors: this.doors, // Türzustand
      targets: Array.from(this.targetFloors).sort((a, b) => a - b), // sortierte Ziele
      calls: this.calls.slice() // Kopie der Calls
    };
  }

  // Gibt den aktuellen Status als JSON auf stdout aus (Deno-Konsole)
  emitStatus() {
    try {
      // JSON.stringify mit 2 spaces für Lesbarkeit
      console.log(JSON.stringify({ type: 'status', timestamp: Date.now(), payload: this.status() }, null, 2));
    } catch (err) {
      // Falls Serialisierung fehlschlägt, gib eine kompakte Darstellung aus
      console.log('STATUS', this.status());
      console.error('Fehler beim Ausgeben des Status', err);
    }
  }
}

// ---------------------- Simulation ----------------------
// Erzeuge einen Aufzug L1 für die Etagen 0..5
const lift = new Lift('L1', 0, 5);

// Ereignisliste: Funktionen, die zu einem bestimmten Zeitschritt ausgeführt werden
const events: Array<(t: number) => void> = [];
// Beispiel-Event-Handler: füge zeitgesteuerte Aktionen hinzu
events.push((t) => {
  if (t === 0) {
    // Bei t=0: Ruf von Etage 3 nach oben
    console.log('[0] Ruf: Etage 3, Richtung Hoch');
    lift.call({ floor: 3, direction: Direction.Up });
  }
  if (t === 1) {
    // Bei t=1: ein Passagier im Aufzug drückt Etage 5
    console.log('[1] Im Aufzug: Taste Etage 5 gedrückt');
    lift.request({ floor: 5 });
  }
  if (t === 2) {
    // Bei t=2: Ruf von Etage 1 nach oben
    console.log('[2] Ruf: Etage 1, Richtung Hoch');
    lift.call({ floor: 1, direction: Direction.Up });
  }
});

// Lädt gespeicherte Calls/Targets beim Start (falls vorhanden)
async function restore() {
  const data = await loadData(); // Daten aus Datei laden
  if (data.calls) for (const c of data.calls) lift.call(c); // Calls wiederherstellen
  if (data.targets) for (const f of data.targets) lift.request({ floor: f }); // interne Ziele wiederherstellen
  // Nach Wiederherstellung einmal den Status ausgeben
  lift.emitStatus();
}

// Speichere aktuelle ausstehende Calls/Targets
async function persist() {
  // status().calls/targets liefern Kopien der aktuellen Wartelisten
  await saveData({ calls: lift.status().calls, targets: lift.status().targets });
}

// Hauptschleife: führe Ereignisse aus, fahre den Aufzug und speichere Zustand
async function run() {
  await restore(); // eventuell vorhandene Daten laden
  // Simuliere 20 Zeitschritte (je Schritt kann ein oder mehrere reale Sekunden vergehen)
  for (let t = 0; t < 20; t++) {
    // Führe alle Event-Handler für den aktuellen Schritt aus
    events.forEach(fn => fn(t));
    // Ein Simulationsschritt (beinhaltet reale Verzögerungen für Bewegung/Türen)
    await lift.step();
    // Ausgabe des aktuellen Zustands (lesbar und als JSON)
    console.log(`t=${t}`);
    lift.emitStatus();
    // Zustand persistieren (sichert Calls/Targets zwischen Läufen)
    await persist();
  }
}

// Wenn die Datei direkt ausgeführt wird, starte die Simulation
if (import.meta.main) {
  run().catch(err => console.error('Fehler in der Simulation', err));
}
