import { NextRequest, NextResponse } from 'next/server';
import { verifyStreamToken } from '@/lib/stream-token';
import { EC2_API_URL } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const file = req.nextUrl.searchParams.get('file');

  if (!token || !file) {
    return NextResponse.json({ error: 'Missing token or file' }, { status: 400 });
  }

  const payload = verifyStreamToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired stream token' }, { status: 403 });
  }

  // Only allow access to the purchased template/resolution
  const allowedPrefix = `templates/${payload.templateId}/${payload.resolution}/`;
  if (!file.startsWith(allowedPrefix)) {
    return NextResponse.json({ error: 'Access denied for this file' }, { status: 403 });
  }

  // Proxy the HLS file from EC2
  const upstream = await fetch(`${EC2_API_URL}/hls/${file}`, {
    headers: { Accept: req.headers.get('accept') || '*/*' },
  });

  if (!upstream.ok) {
    return new NextResponse('Not found', { status: 404 });
  }

  const contentType = file.endsWith('.m3u8')
    ? 'application/vnd.apple.mpegurl'
    : file.endsWith('.ts')
      ? 'video/MP2T'
      : upstream.headers.get('content-type') || 'application/octet-stream';

  const body = upstream.body;

  // For m3u8 playlists, rewrite segment URLs to include the token
  if (file.endsWith('.m3u8') && body) {
    const text = await upstream.text();
    const dir = file.substring(0, file.lastIndexOf('/') + 1);
    // Rewrite relative segment references to go through this API with the token
    const rewritten = text.replace(
      /^(segment_\d+\.ts)$/gm,
      (seg) => `/api/stream?token=${encodeURIComponent(token)}&file=${encodeURIComponent(dir + seg)}`,
    );
    return new NextResponse(rewritten, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=300',
      },
    });
  }

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
