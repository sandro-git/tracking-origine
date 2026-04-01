# Tracking Origine Clients — VR Café

App de caisse pour traquer l'origine des clients. Stack : Astro + Turso (libSQL) + Netlify.

## Setup Turso

### 1. Créer la base
```bash
turso auth login
turso db create tracking-origine
turso db show tracking-origine --url      # → TURSO_DATABASE_URL
turso db tokens create tracking-origine  # → TURSO_AUTH_TOKEN
```

### 2. Créer la table
```bash
turso db shell tracking-origine < turso/migrations.sql
```

### 3. Connecter via l'extension Netlify
1. Netlify → **Extensions** → "Turso" → Installe → configure avec ton API token
2. Site → **Project configuration** → **Turso** → sélectionne ta base → Save
3. L'extension injecte `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN` automatiquement
4. Redéploie → c'est en ligne

## Développement local

```bash
cp .env-example .env   # remplis les deux variables Turso
npm install
netlify link
netlify dev --target-port 4321
```

## Structure

```
src/
  pages/
    index.astro        # UI principale SSR
    api/
      entries.ts       # POST : enregistre une entrée
      stats.ts         # GET  : stats par période
      export.ts        # GET  : export CSV
  lib/
    turso.ts           # client libSQL
turso/
  migrations.sql       # schéma SQLite/libSQL
```

## Multi-sites (Yucatan, etc.)

Même base Turso, change juste `site: 'VR Café'` dans `index.astro` et déploie un second site Netlify.
