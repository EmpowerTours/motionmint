import { NextRequest, NextResponse } from 'next/server';
import { createStreamToken } from '@/lib/stream-token';
import { EC2_API_URL } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const { wallet, template_id, resolution } = await req.json();

    if (!wallet || !template_id || !resolution) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify the user actually purchased this template
    const res = await fetch(`${EC2_API_URL}/user/${wallet}/purchases`);
    const data = await res.json();
    const purchases = data.purchases || [];

    const hasPurchase = purchases.some(
      (p: { template_id: string; resolution: string }) =>
        p.template_id === template_id && p.resolution === resolution,
    );

    if (!hasPurchase) {
      return NextResponse.json({ error: 'No purchase found' }, { status: 403 });
    }

    const token = createStreamToken(wallet, template_id, resolution);
    const streamUrl = `/api/stream?token=${encodeURIComponent(token)}&file=templates/${template_id}/${resolution}/index.m3u8`;

    return NextResponse.json({ token, streamUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to generate stream token' }, { status: 500 });
  }
}
