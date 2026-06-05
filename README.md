# Second Brain MVP

Voice-first Web-App für ein persönliches KI-Gedächtnis.

Kernversprechen: Sprich einfach los. Deine KI ordnet alles für dich.

## Technische Planung

Der aktuelle Stand umfasst das tragfähige Frontend-Grundgerüst und Supabase Auth:

- Next.js mit App Router, TypeScript und Tailwind CSS
- mobile-first Layout mit zentraler App-Shell
- Bottom Navigation für die fünf Hauptbereiche
- leere Platzhalterseiten für den späteren Produktfluss
- Supabase Auth per Magic Link / Email OTP
- geschützte Hauptseiten über serverseitiges Protected Layout
- Supabase-Datenbankfundament mit RLS-Migration
- noch keine OpenAI-Integration
- noch keine Aufnahmefunktion

Die Architektur bleibt bewusst klein, damit Recording, Transkription und Speicherung später sauber ergänzt werden können.

## Ordnerstruktur

```txt
app/
  auth/
    confirm/
  (protected)/
    capture/
    today/
    memory/
    loops/
    chat/
  login/
components/
  AppShell.tsx
  BottomNav.tsx
  CaptureButton.tsx
  LoginForm.tsx
  LogoutButton.tsx
  PlaceholderCard.tsx
lib/
  supabase/
    client.ts
    server.ts
  types.ts
db/
  migrations/
    001_initial_schema.sql
```

## Environment Variables

Lege lokal eine `.env.local` an. Für Auth werden nur die beiden öffentlichen Supabase-Variablen verwendet. `SUPABASE_SERVICE_ROLE_KEY` und `OPENAI_API_KEY` sind Platzhalter für spätere Schritte und werden aktuell nicht im Browser genutzt.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Supabase Auth einrichten

1. Erstelle ein Supabase-Projekt.
2. Kopiere aus `Project Settings > API` die `Project URL` nach `NEXT_PUBLIC_SUPABASE_URL`.
3. Kopiere den `anon public` Key nach `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Aktiviere unter `Authentication > Providers` den Email-Provider.
5. Setze unter `Authentication > URL Configuration` die lokale Site URL:

```txt
http://localhost:3000
```

6. Erlaube als Redirect URL:

```txt
http://localhost:3000/auth/confirm
```

Für Deployments muss zusätzlich die Vercel-Domain als Site URL bzw. Redirect URL eingetragen werden.

## Supabase Datenbankmigration ausführen

Die initiale Migration liegt unter:

```txt
db/migrations/001_initial_schema.sql
```

So führst du sie in Supabase aus:

1. Öffne dein Supabase-Projekt.
2. Gehe zu `SQL Editor`.
3. Erstelle eine neue Query.
4. Kopiere den vollständigen Inhalt aus `db/migrations/001_initial_schema.sql`.
5. Führe die Query aus.
6. Prüfe unter `Table Editor`, ob diese Tabellen sichtbar sind:

```txt
profiles
thoughts
extracted_items
weekly_reviews
```

RLS wird in der Migration für alle Tabellen aktiviert. Die Policies erlauben angemeldeten Nutzern nur Zugriff auf eigene Datensätze.

## Supabase Smoke Test

Nach Auth-Setup und ausgeführter Datenbankmigration zeigt `/today` einen kleinen Bereich `Systemstatus`.

Erwartete Werte bei einem frisch eingeloggten Nutzer:

```txt
Angemeldet als: deine-email@example.com
Profil gefunden: Ja
Gespeicherte Gedanken: 0
Offene Loops: 0
```

So testest du lokal:

1. `.env.local` mit `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` setzen.
2. Supabase-Migration aus `db/migrations/001_initial_schema.sql` ausführen.
3. `npm run dev` starten.
4. Per Magic Link einloggen.
5. `/today` öffnen und den Bereich `Systemstatus` prüfen.

Typische Fehler:

- `Profil gefunden: Nein`: Trigger `on_auth_user_created` fehlt, Migration wurde vor dem Login nicht ausgeführt oder das Profil wurde manuell gelöscht.
- Fehler beim Zählen: Tabellen fehlen, RLS-Policies fehlen oder die Migration wurde nicht vollständig ausgeführt.
- Weiterleitung zu `/login`: Session fehlt oder Supabase Auth-Redirect ist falsch konfiguriert.

## Lokales Setup

```bash
npm install
npm run dev
```

Die App läuft danach standardmäßig unter:

```txt
http://localhost:3000
```

## Nützliche Checks

```bash
npm run typecheck
npm run build
```

## Aktuelle Seiten

- `/capture` - Startflow mit großem "Sprich los"-Button
- `/today` - Platzhalter für Tagesübersicht
- `/memory` - Platzhalter für gespeicherte Gedanken
- `/loops` - Platzhalter für offene Aufgaben, Entscheidungen, Fragen und Ideen
- `/chat` - Platzhalter für Chat über das Gedächtnis
- `/login` - Magic-Link-Login per Supabase Auth

## Auth lokal testen

1. `.env.local` mit den Supabase-Werten anlegen.
2. `npm run dev` starten.
3. `http://localhost:3000/capture` öffnen.
4. Ohne Session solltest du nach `/login` weitergeleitet werden.
5. E-Mail eingeben und Magic Link senden.
6. Link aus der E-Mail öffnen.
7. Nach erfolgreichem Login solltest du auf `/capture` landen.
8. Mit `Abmelden` wird die Session beendet und du landest auf `/login`.

## Nächster sinnvoller Schritt

Als nächstes sollte Audio Recording im Browser als lokaler UI-Flow ergänzt werden.
