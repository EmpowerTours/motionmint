'use client';

import { RESOLUTIONS } from '@/lib/constants';
import { Monitor, Tv, Maximize } from 'lucide-react';
import { formatEther } from 'viem';

const ICONS = [Monitor, Tv, Maximize];

interface ResolutionPickerProps {
  selected: number;
  onChange: (id: number) => void;
  prices: (bigint | null)[];
}

export default function ResolutionPicker({ selected, onChange, prices }: ResolutionPickerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
        Select Resolution
      </h3>
      {RESOLUTIONS.map((res, i) => {
        const Icon = ICONS[i];
        const isSelected = selected === res.id;
        const price = prices[i];
        return (
          <button
            key={res.id}
            className={`resolution-option ${isSelected ? 'selected' : ''}`}
            onClick={() => onChange(res.id)}
            style={{ textAlign: 'left' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon size={20} style={{ color: isSelected ? '#a855f7' : 'rgba(255,255,255,0.4)' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{res.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{res.label}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: isSelected ? '#a855f7' : 'white' }}>
                  {price !== null ? `${Number(formatEther(price)).toFixed(1)} MON` : '...'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{res.usd}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
