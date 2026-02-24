'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createPublicClient, http } from 'viem';
import { ArrowLeft, Tag, Clock, Layers, CheckCircle } from 'lucide-react';
import { monad } from '@/lib/monad';
import { VIDEO_BG_CONTRACT_ADDRESS, VIDEO_BG_ABI } from '@/lib/contracts';
import { RESOLUTIONS, PURCHASE_DURATION, type Template } from '@/lib/constants';
import Navbar from '@/components/shared/Navbar';
import HLSPlayer from '@/components/shared/HLSPlayer';
import ResolutionPicker from '@/components/purchase/ResolutionPicker';
import PurchaseButton from '@/components/purchase/PurchaseButton';

export default function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [selectedRes, setSelectedRes] = useState(1); // Default 1080p
  const [prices, setPrices] = useState<(bigint | null)[]>([null, null, null]);
  const [purchasedUrl, setPurchasedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch template data
  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((data) => {
        const found = data.templates?.find((t: Template) => t.id === id);
        setTemplate(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch on-chain prices
  useEffect(() => {
    if (!template) return;

    const client = createPublicClient({ chain: monad, transport: http() });
    const styleId = template.style_id;

    Promise.all(
      RESOLUTIONS.map(async (res) => {
        try {
          const price = await client.readContract({
            address: VIDEO_BG_CONTRACT_ADDRESS,
            abi: VIDEO_BG_ABI,
            functionName: 'getPrice',
            args: [styleId, res.id, BigInt(PURCHASE_DURATION)],
          });
          return price as bigint;
        } catch {
          return null;
        }
      })
    ).then(setPrices);
  }, [template]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060608' }}>
        <Navbar />
        <div style={{ paddingTop: 140, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div style={{ minHeight: '100vh', background: '#060608' }}>
        <Navbar />
        <div style={{ paddingTop: 140, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>Template Not Found</p>
          <button
            onClick={() => router.push('/')}
            style={{
              marginTop: 16,
              padding: '10px 24px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  const previewSrc = template.has_preview
    ? `/hls/templates/${template.id}/preview.mp4`
    : null;

  const hlsSrc = template.available_resolutions.includes('1080p')
    ? `/hls/templates/${template.id}/1080p/index.m3u8`
    : template.available_resolutions.length > 0
      ? `/hls/templates/${template.id}/${template.available_resolutions[0]}/index.m3u8`
      : null;

  return (
    <div style={{ minHeight: '100vh', background: '#060608' }}>
      <Navbar />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 24px 80px' }}>
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 0',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={16} />
          Back to Gallery
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40, alignItems: 'start' }}>
          {/* Left: Preview */}
          <div>
            {/* Video preview */}
            <div
              className="liquid-glass"
              style={{
                aspectRatio: '16/9',
                overflow: 'hidden',
                marginBottom: 24,
              }}
            >
              {hlsSrc ? (
                <HLSPlayer src={hlsSrc} />
              ) : previewSrc ? (
                <video
                  src={previewSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: 16,
                  }}
                >
                  Preview Coming Soon
                </div>
              )}
            </div>

            {/* Template info */}
            <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8 }}>
              {template.name}
            </h1>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                background: 'rgba(168,85,247,0.15)',
                color: '#a855f7',
                marginBottom: 16,
              }}
            >
              {template.category_name}
            </span>
            <p
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              {template.description}
            </p>

            {/* Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 24,
              }}
            >
              {[
                { icon: Clock, label: 'Duration', value: '20s loop' },
                { icon: Layers, label: 'Resolutions', value: template.available_resolutions.length > 0 ? template.available_resolutions.join(', ') : 'All' },
                { icon: Tag, label: 'Category', value: template.category_name },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="liquid-glass"
                  style={{ padding: 16 }}
                >
                  <Icon size={16} style={{ color: '#a855f7', marginBottom: 8 }} />
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Purchase panel */}
          <div
            className="liquid-glass"
            style={{
              padding: 28,
              position: 'sticky',
              top: 88,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 24 }}>
              Purchase License
            </h2>

            <ResolutionPicker
              selected={selectedRes}
              onChange={setSelectedRes}
              prices={prices}
            />

            <div
              style={{
                height: 1,
                background: 'rgba(255,255,255,0.08)',
                margin: '24px 0',
              }}
            />

            {/* What you get */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
                What you get
              </h4>
              {[
                'Instant HLS streaming URL',
                'Permanent access — no subscription',
                'Use in presentations, streams, websites',
                'On-chain payment receipt',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>

            <PurchaseButton
              styleId={template.style_id}
              resolutionId={selectedRes}
              price={prices[selectedRes]}
              templateId={template.id}
              onSuccess={(url) => setPurchasedUrl(url)}
            />

            {purchasedUrl && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 12,
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: '#22c55e', marginBottom: 8 }}>
                  Purchase Complete!
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', wordBreak: 'break-all' }}>
                  HLS URL: {purchasedUrl}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
