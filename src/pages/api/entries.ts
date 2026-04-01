import type { APIRoute } from 'astro';
import { db } from '../../lib/turso';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { origin, origin_label, sub_origin, adults, children, note, site } = body;

    if (!origin || !origin_label || adults === undefined) {
      return new Response(JSON.stringify({ error: 'Champs requis manquants' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const now = new Date();
    const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const date = now.toISOString().split('T')[0];
    const total = (adults || 1) + (children || 0);
    const id = crypto.randomUUID();

    await db.execute({
      sql: `INSERT INTO entries (id, date, heure, origin, origin_label, sub_origin, adults, children, total, note, site)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, date, heure, origin, origin_label, sub_origin || null, adults || 1, children || 0, total, note || null, site || 'VR Café']
    });

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
