import { NextResponse } from 'next/server';

export async function GET() {
  const BASE = process.env.AIRTABLE_BASE;
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const API = `https://api.airtable.com/v0/${BASE}`;
  const headers = { Authorization: `Bearer ${TOKEN}` };

  const tables = ['Topics', 'Agents', 'Agent Post', 'Agent Replies', 'Stances'];
  const results: any = {};

  for (const table of tables) {
    try {
      const res = await fetch(`${API}/${encodeURIComponent(table)}?maxRecords=1`, { headers });
      results[table] = { status: res.status, ok: res.ok };
    } catch (e: any) {
      results[table] = { error: e.message };
    }
  }

  return NextResponse.json({
    token_prefix: TOKEN?.slice(0, 10) + '...',
    base: BASE,
    tables: results,
  });
}