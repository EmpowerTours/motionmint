import { NextRequest, NextResponse } from 'next/server';
import { EC2_API_URL } from '@/lib/constants';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const res = await fetch(`${EC2_API_URL}/user/${address}/purchases`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Purchase service unavailable' }, { status: 503 });
  }
}
