# Vocare Fullstack Challenge – Kalender- & Termin-App

Eine moderne Kalender- und Terminverwaltungs-App mit Next.js, React, shadcn/ui und Supabase. Enthält Monats-, Wochen- und Listenansichten, Filter, Termin-Erstellung/Bearbeitung und mehr.

## Funktionen

- 📅 Monats-, Wochen- und Listenansicht für Termine
- 🔍 Termine filtern nach Kategorie, Patient und Zeitraum
- ➕ Termine in Dialogen erstellen und bearbeiten
- 🕒 Termin-Details per Hover-Card
- ♻️ Unendliches Nachladen für vergangene/kommende Termine
- ⚡ Schnelle, reaktionsfähige UI mit shadcn/ui und Tailwind CSS
- 🔄 Datenabruf und Caching mit SWR
- 🟢 Lade-Spinner für asynchrone Zustände

## Technologiestack

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) (Backend)
- [SWR](https://swr.vercel.app/) (Datenfetching)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-spinners](https://www.davidhu.io/react-spinners/) (Loader)
- [date-fns](https://date-fns.org/) (Datum-Utils)

## Schnellstart

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   # oder yarn install
   ```
2. **Umgebungsvariablen einrichten:**
   - Kopiere `.env.example` zu `.env.local` und trage deine Supabase-Zugangsdaten ein.
3. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```
   Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Projektstruktur

- `app/` – Next.js App-Verzeichnis (API-Routen, Context, Seiten)
- `components/` – UI- und Shared-Komponenten
- `hooks/` – Eigene React-Hooks für Termine
- `lib/` – Utilities, Schemas und Supabase-Client
- `types/` – TypeScript-Typen

## API-Endpunkte

- `GET/POST /api/appointments` – Termine auflisten/erstellen
- `GET/PUT /api/appointments/[id]` – Termin nach ID abrufen/aktualisieren
- `GET /api/categories` – Kategorien auflisten
- `GET /api/patients` – Patienten auflisten

## UI-Änderungen

- Monatsansicht Navigation: Um zum nächsten Monat zu wechseln, klicke auf ein Datum, das zum nächsten Monat gehört (diese Daten sind in einem abgeschwächten Stil dargestellt).

## Lizenz

MIT – Für Bildungs- und Demozwecke.
