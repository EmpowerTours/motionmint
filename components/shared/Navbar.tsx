'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import Logo from './Logo';

const navItems = [
  { href: '/', label: 'Gallery' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pitch', label: 'Pitch Deck' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { login, logout, authenticated, user } = usePrivy();

  const shortAddress = user?.wallet?.address
    ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
    : null;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        background: 'rgba(6,6,8,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/' || pathname === '/gallery'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {authenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: 'monospace',
                }}
              >
                {shortAddress}
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '8px 16px',
                  borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              style={{
                padding: '8px 20px',
                borderRadius: 100,
                border: 'none',
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
