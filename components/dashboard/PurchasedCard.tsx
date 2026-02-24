'use client';

import { useState } from 'react';
import { Play, Download, Copy, Check } from 'lucide-react';
import HLSPlayer from '../shared/HLSPlayer';
import type { Purchase } from '@/lib/constants';

interface PurchasedCardProps {
  purchase: Purchase;
}

export default function PurchasedCard({ purchase }: PurchasedCardProps) {
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const hlsUrl = purchase.hls_url.startsWith('/hls')
    ? purchase.hls_url
    : `/hls/templates/${purchase.template_id}/${purchase.resolution}/index.m3u8`;

  const templateName = purchase.template_id
    .split('-')
    .slice(1)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + hlsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="liquid-glass">
      {/* Video / Thumbnail area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        {playing ? (
          <HLSPlayer src={hlsUrl} controls />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))',
            }}
            onClick={() => setPlaying(true)}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Play size={24} fill="white" style={{ color: 'white', marginLeft: 2 }} />
            </div>
          </div>
        )}

        {/* Resolution badge */}
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: '2px 10px',
            borderRadius: 6,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            fontSize: 11,
            fontWeight: 600,
            color: 'white',
          }}
        >
          {purchase.resolution}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 20px 20px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>
          {templateName}
        </h3>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
          Purchased {new Date(purchase.purchased_at).toLocaleDateString()}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy HLS URL'}
          </button>
          <a
            href={hlsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Download size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
