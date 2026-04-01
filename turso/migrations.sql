-- Table de tracking des origines clients (SQLite / Turso)
CREATE TABLE IF NOT EXISTS entries (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  created_at  TEXT DEFAULT (datetime('now')) NOT NULL,
  date        TEXT DEFAULT (date('now')) NOT NULL,
  heure       TEXT NOT NULL,
  origin      TEXT NOT NULL,
  origin_label TEXT NOT NULL,
  sub_origin  TEXT,
  adults      INTEGER NOT NULL DEFAULT 1,
  children    INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 1,
  note        TEXT,
  site        TEXT NOT NULL DEFAULT 'VR Café'
);

CREATE INDEX IF NOT EXISTS entries_date_idx   ON entries(date DESC);
CREATE INDEX IF NOT EXISTS entries_origin_idx ON entries(origin);
CREATE INDEX IF NOT EXISTS entries_site_idx   ON entries(site);
