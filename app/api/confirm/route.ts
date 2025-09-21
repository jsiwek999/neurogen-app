import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string
    );

    const { error } = await supabase
      .from('subscribers')
      .update({ confirmed: true })
      .eq('email', email);

    if (error) {
      console.error('Confirm update error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (e) {
    console.error('Confirm handler error:', e);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
