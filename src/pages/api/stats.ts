import type { APIRoute } from 'astro';
import { db } from '../../lib/turso';

export const GET: APIRoute = async ({ url }) => {
  try {
    const period = url.searchParams.get('period') || 'today';
    const site = url.searchParams.get('site') || 'VR Café';

    let dateFilter = '';
    const args: string[] = [site];

    if (period === 'today') {
      dateFilter = `AND date = date('now')`;
    } else if (period === 'week') {
      dateFilter = `AND date >= date('now', '-7 days')`;
    } else if (period === 'month') {
      dateFilter = `AND date >= date('now', '-30 days')`;
    }

    const result = await db.execute({
      sql: `SELECT * FROM entries WHERE site = ? ${dateFilter} ORDER BY created_at DESC`,
      args
    });

    const entries = result.rows as any[];

    const totalGroups = entries.length;
    const totalPeople = entries.reduce((s, e) => s + (e.total || 0), 0);

    const originCounts: Record<string, number> = {};
    entries.forEach(e => {
      const key = e.origin_label + (e.sub_origin ? ` — ${e.sub_origin}` : '');
      originCounts[key] = (originCounts[key] || 0) + e.total;
    });

    const originStats = Object.entries(originCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));

    return new Response(JSON.stringify({
      entries: entries.slice(0, 10),
      stats: { totalGroups, totalPeople, originStats }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Stats error:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
