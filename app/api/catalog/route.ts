import { NextResponse } from 'next/server';
import { EC2_API_URL } from '@/lib/constants';

export async function GET() {
  try {
    const res = await fetch(`${EC2_API_URL}/catalog`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Catalog service unavailable' }, { status: 503 });
  }
}
