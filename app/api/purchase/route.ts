import { NextRequest, NextResponse } from 'next/server';
import { EC2_API_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template_id, resolution, tx_hash, wallet } = body;

    if (!template_id || !resolution || !tx_hash || !wallet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch(`${EC2_API_URL}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id, resolution, tx_hash, wallet }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Purchase service unavailable' }, { status: 503 });
  }
}
