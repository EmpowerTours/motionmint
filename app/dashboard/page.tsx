'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ShoppingBag, LogIn } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import PurchasedCard from '@/components/dashboard/PurchasedCard';
import type { Purchase } from '@/lib/constants';

export default function DashboardPage() {
  const { authenticated, user, login } = usePrivy();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const address = user?.wallet?.address;
    if (!address) return;

    setLoading(true);
    fetch(`/api/user/${address}/purchases`)
      .then((r) => r.json())
      .then(async (data) => {
        const rawPurchases: Purchase[] = data.purchases || [];
        // Get stream tokens for each purchase
        const withTokens = await Promise.all(
          rawPurchases.map(async (p) => {
            try {
              const res = await fetch('/api/stream-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet: address, template_id: p.template_id, resolution: p.resolution }),
              });
              const tokenData = await res.json();
              return { ...p, streamUrl: tokenData.streamUrl || p.hls_url };
            } catch {
              return { ...p, streamUrl: p.hls_url };
            }
          }),
        );
        setPurchases(withTokens);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.wallet?.address]);

  return (
    <div style={{ minHeight: '100vh', background: '#060608' }}>
      <Navbar />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8 }}>
          My Library
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
          Your purchased video backgrounds with streaming links
        </p>

        {!authenticated ? (
          <div
            className="liquid-glass"
            style={{
              padding: 60,
              textAlign: 'center',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            <LogIn size={40} style={{ color: '#a855f7', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>
              Connect Your Wallet
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
              Connect your wallet to view your purchased templates
            </p>
            <button
              onClick={login}
              style={{
                padding: '12px 32px',
                borderRadius: 100,
                border: 'none',
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Connect Wallet
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
            Loading your purchases...
          </div>
        ) : purchases.length === 0 ? (
          <div
            className="liquid-glass"
            style={{
              padding: 60,
              textAlign: 'center',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            <ShoppingBag size={40} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>
              No Purchases Yet
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
              Browse our gallery to find the perfect video background
            </p>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                borderRadius: 100,
                border: 'none',
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Browse Gallery
            </a>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: 24,
            }}
          >
            {purchases.map((p, i) => (
              <PurchasedCard key={`${p.tx_hash}-${i}`} purchase={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
