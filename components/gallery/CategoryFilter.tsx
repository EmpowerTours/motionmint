'use client';

import { CATEGORIES } from '@/lib/constants';

interface CategoryFilterProps {
  selected: number | null;
  onChange: (id: number | null) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button
        className={`category-pill ${selected === null ? 'active' : ''}`}
        onClick={() => onChange(null)}
      >
        All Templates
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`category-pill ${selected === cat.id ? 'active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
