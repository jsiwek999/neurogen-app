// app/api/admin/subscribers/export/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const expected = process.env.EXPORT_API_TOKEN;
  if (!expected || auth !== `Bearer ${expected}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data, error } = await supabaseService
    .from('newsletter_subscribers')
    .select('email,created_at,confirmed_at,unsubscribed_at')
    .order('created_at', { ascending: false });

  if (error) return new NextResponse('DB error', { status: 500 });

  const rows = data ?? [];
  const csv = ['email,created_at,confirmed_at,unsubscribed_at']
    .concat(rows.map(r => [
      r.email,
      r.created_at,
      r.confirmed_at ?? '',
      r.unsubscribed_at ?? ''
    ].join(',')))
    .join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="subscribers.csv"',
    },
  });
}
