'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom, formatEther } from 'viem';
import { monad } from '@/lib/monad';
import { VIDEO_BG_CONTRACT_ADDRESS, VIDEO_BG_ABI } from '@/lib/contracts';
import { PURCHASE_DURATION } from '@/lib/constants';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'connecting' | 'signing' | 'confirming' | 'recording' | 'success' | 'error';

interface PurchaseButtonProps {
  styleId: number;
  resolutionId: number;
  price: bigint | null;
  templateId: string;
  onSuccess: (hlsUrl: string) => void;
}

export default function PurchaseButton({
  styleId,
  resolutionId,
  price,
  templateId,
  onSuccess,
}: PurchaseButtonProps) {
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!price) return;

    const wallet = wallets[0];
    if (!wallet) {
      setError('No wallet connected');
      return;
    }

    try {
      setStatus('connecting');
      setError(null);

      await wallet.switchChain(monad.id);
      const provider = await wallet.getEthereumProvider();

      const walletClient = createWalletClient({
        chain: monad,
        transport: custom(provider),
      });

      const [address] = await walletClient.getAddresses();

      setStatus('signing');

      const hash = await walletClient.writeContract({
        address: VIDEO_BG_CONTRACT_ADDRESS,
        abi: VIDEO_BG_ABI,
        functionName: 'payWithMON',
        args: [styleId, resolutionId, BigInt(PURCHASE_DURATION)],
        value: price,
        account: address,
      });

      setTxHash(hash);
      setStatus('confirming');

      // Wait for confirmation
      const { createPublicClient, http } = await import('viem');
      const publicClient = createPublicClient({ chain: monad, transport: http() });
      await publicClient.waitForTransactionReceipt({ hash });

      setStatus('recording');

      // Record purchase on EC2
      const resName = ['720p', '1080p', '4k'][resolutionId];
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: templateId,
          resolution: resName,
          tx_hash: hash,
          wallet: address,
        }),
      });

      const data = await res.json();
      if (data.hls_url) {
        setStatus('success');
        onSuccess(data.hls_url);
      } else {
        setStatus('success');
        onSuccess(`/hls/templates/${templateId}/${resName}/index.m3u8`);
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  const buttonLabel = () => {
    if (!authenticated) return 'Connect Wallet to Purchase';
    switch (status) {
      case 'connecting': return 'Connecting...';
      case 'signing': return 'Sign Transaction...';
      case 'confirming': return 'Confirming on Monad...';
      case 'recording': return 'Recording Purchase...';
      case 'success': return 'Purchase Complete!';
      case 'error': return 'Try Again';
      default: return price ? `Pay ${Number(formatEther(price)).toFixed(1)} MON` : 'Loading Price...';
    }
  };

  const isLoading = ['connecting', 'signing', 'confirming', 'recording'].includes(status);
  const isDisabled = isLoading || (!authenticated && false) || (authenticated && !price);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        onClick={handlePurchase}
        disabled={isDisabled}
        style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: 12,
          border: 'none',
          background: status === 'success'
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : status === 'error'
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #a855f7, #06b6d4)',
          color: 'white',
          fontSize: 15,
          fontWeight: 700,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled && status !== 'success' ? 0.5 : 1,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {isLoading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
        {status === 'success' && <CheckCircle size={18} />}
        {status === 'error' && <AlertCircle size={18} />}
        {buttonLabel()}
      </button>

      {txHash && (
        <a
          href={`https://monadscan.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            color: 'rgba(168,85,247,0.8)',
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          View on MonadScan
        </a>
      )}

      {error && (
        <p style={{ fontSize: 12, color: '#ef4444', textAlign: 'center' }}>
          {error}
        </p>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
