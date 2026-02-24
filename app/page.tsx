'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Play, Zap } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import CategoryFilter from '@/components/gallery/CategoryFilter';
import TemplateGrid from '@/components/gallery/TemplateGrid';
import type { Template } from '@/lib/constants';

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/catalog')
      .then((r) => r.json())
      .then((data) => {
        setTemplates(data.templates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = selectedCategory !== null
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  // Sort: templates with assets first
  const sorted = [...filtered].sort((a, b) => {
    if (a.has_thumbnail && !b.has_thumbnail) return -1;
    if (!a.has_thumbnail && b.has_thumbnail) return 1;
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#060608' }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          paddingTop: 140,
          paddingBottom: 60,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(168,85,247,0.08)',
            filter: 'blur(120px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '15%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(6,182,212,0.06)',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 100,
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.2)',
              marginBottom: 24,
              fontSize: 13,
              fontWeight: 600,
              color: '#a855f7',
            }}
          >
            <Sparkles size={14} />
            AI-Powered Video Backgrounds
          </div>

          <h1
            className="animate-fade-in animate-fade-in-d1"
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: 'white',
              marginBottom: 16,
            }}
          >
            Premium Video
            <br />
            <span className="gradient-text">Backgrounds</span>
          </h1>

          <p
            className="animate-fade-in animate-fade-in-d2"
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 540,
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Cinematic AI-generated video backgrounds for presentations, live streams, and creative projects.
            Pay once, stream forever.
          </p>

          <div
            className="animate-fade-in animate-fade-in-d3"
            style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}
          >
            {[
              { icon: Play, label: '24 Templates', sub: '3 categories' },
              { icon: Zap, label: 'HLS Streaming', sub: 'Instant playback' },
              { icon: Sparkles, label: 'On-Chain', sub: 'Monad payments' },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 13,
                }}
              >
                <Icon size={16} style={{ color: '#a855f7' }} />
                <div>
                  <span style={{ color: 'white', fontWeight: 600 }}>{label}</span>
                  <span style={{ marginLeft: 6 }}>{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>
            Browse Templates
            {!loading && (
              <span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: 12 }}>
                {sorted.length} templates
              </span>
            )}
          </h2>
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)' }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: '#a855f7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            Loading templates...
            <style jsx>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <TemplateGrid templates={sorted} />
        )}
      </div>
    </div>
  );
}
