'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Eye } from 'lucide-react';
import type { Template } from '@/lib/constants';
import { CATEGORIES } from '@/lib/constants';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const category = CATEGORIES[template.category];
  const hasAssets = template.has_thumbnail || template.has_preview;
  const thumbnailUrl = template.thumbnail_url ? `/hls/templates/${template.id}/thumbnail.jpg` : null;
  const previewUrl = template.preview_url ? `/hls/templates/${template.id}/preview.mp4` : null;

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && previewUrl) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link href={`/template/${template.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="liquid-glass"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          transition: 'transform 0.3s ease, border-color 0.3s ease',
          transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* Thumbnail / Preview area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            background: hasAssets
              ? 'transparent'
              : `linear-gradient(135deg, ${category ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.05)'}, rgba(6,182,212,0.1))`,
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden',
          }}
        >
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={template.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isHovering && previewUrl ? 0 : 1,
                transition: 'opacity 0.3s',
              }}
            />
          )}
          {previewUrl && (
            <video
              ref={videoRef}
              src={previewUrl}
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />
          )}

          {/* No assets placeholder */}
          {!hasAssets && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <Play size={32} style={{ opacity: 0.3 }} />
              <span style={{ fontSize: 12, opacity: 0.4 }}>Coming Soon</span>
            </div>
          )}

          {/* Hover overlay */}
          {hasAssets && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            >
              <Eye size={24} style={{ color: 'white' }} />
            </div>
          )}

          {/* Resolution badges */}
          {template.available_resolutions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 4,
              }}
            >
              {template.available_resolutions.map((res) => (
                <span
                  key={res}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {res}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info section */}
        <div style={{ padding: '16px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                padding: '2px 10px',
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 600,
                background: 'rgba(168,85,247,0.15)',
                color: 'rgba(168,85,247,0.9)',
              }}
            >
              {template.category_name}
            </span>
          </div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'white',
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {template.name}
          </h3>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {template.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
