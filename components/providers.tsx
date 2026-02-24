'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { monad } from '@/lib/monad';

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // Skip Privy during build/SSR when no app ID is set
  if (!appId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#a855f7',
        },
        defaultChain: monad,
        supportedChains: [monad],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        externalWallets: {
          coinbaseWallet: {
            config: {
              preference: { options: 'eoaOnly' },
            },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
