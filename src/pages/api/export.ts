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
      sql: `SELECT * FROM entries WHERE site = ? ${dateFilter} ORDER BY date DESC, created_at DESC`,
      args
    });

    const entries = result.rows as any[];

    const headers = ['Date', 'Heure', 'Source', 'Sous-source', 'Adultes', 'Enfants', 'Total', 'Note', 'Site'];
    const rows = entries.map(e => [
      e.date, e.heure, e.origin_label, e.sub_origin || '', e.adults, e.children, e.total, e.note || '', e.site
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const filename = `origine_clients_${period}_${new Date().toISOString().split('T')[0]}.csv`;

    return new Response('\uFEFF' + csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (err) {
    console.error('Export error:', err);
    return new Response('Erreur serveur', { status: 500 });
  }
};
