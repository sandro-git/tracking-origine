import { createClient } from '@libsql/client';

const url = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error('Missing TURSO_DATABASE_URL environment variable');
}

export const db = createClient({ url, authToken });

export type Entry = {
  id?: string;
  created_at?: string;
  date?: string;
  heure: string;
  origin: string;
  origin_label: string;
  sub_origin?: string | null;
  adults: number;
  children: number;
  total: number;
  note?: string;
  site?: string;
};
