# SWP Graf Hausaufgabe

## Dateien im Projekt

### Wichtige Dateien:
- `main.ts` - Ihr Deno Hauptprogramm
- `main_test.ts` - Deno Tests
- `deno.json` - Deno Konfiguration
- `prisma/schema.prisma` - Ihre Datenbank Schema
- `package.json` - Node.js/Prisma Konfiguration
- `.env` - Datenbank Verbindungsstring

### Original Schema:
- `10-09-2025/schema1 copy.prisma` - Ihr ursprüngliches Prisma Schema

## Befehle

### Deno (für Ihr Hauptprogramm):
```bash
# Programm ausführen
deno task dev

# Tests ausführen
deno test
```

### Prisma (für Datenbank):
```bash
# Prisma Client generieren
"C:\Program Files\nodejs\npx.cmd" prisma generate

# Schema zur Datenbank pushen
"C:\Program Files\nodejs\npx.cmd" prisma db push

# Migration erstellen
"C:\Program Files\nodejs\npx.cmd" prisma migrate dev --name "migration_name"

# Prisma Studio öffnen (Datenbank GUI)
"C:\Program Files\nodejs\npx.cmd" prisma studio
```

## Setup
1. Deno ist bereits installiert ✅
2. Node.js ist bereits installiert ✅  
3. Prisma Schema ist bereit ✅
4. SQLite Datenbank wird automatisch erstellt

## Nächste Schritte
1. Arbeiten Sie mit Ihrem `main.ts` für das Deno-Programm
2. Verwenden Sie die Prisma-Befehle für die Datenbank
3. Das Schema in `prisma/schema.prisma` ist bereit für SQLite