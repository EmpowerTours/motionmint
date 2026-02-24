'use client';

import type { Template } from '@/lib/constants';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: Template[];
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 600 }}>No templates found</p>
        <p style={{ fontSize: 14, marginTop: 8 }}>Try a different category filter</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24,
      }}
    >
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
