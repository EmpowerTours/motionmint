import { EC2_API_URL, type CatalogResponse, type Purchase } from './constants';

export async function fetchCatalog(): Promise<CatalogResponse> {
  const res = await fetch(`${EC2_API_URL}/catalog`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}

export async function submitPurchase(data: {
  template_id: string;
  resolution: string;
  tx_hash: string;
  wallet: string;
}): Promise<{ success: boolean; hls_url?: string; error?: string }> {
  const res = await fetch(`${EC2_API_URL}/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchUserPurchases(address: string): Promise<Purchase[]> {
  const res = await fetch(`${EC2_API_URL}/user/${address}/purchases`);
  if (!res.ok) throw new Error('Failed to fetch purchases');
  const data = await res.json();
  return data.purchases || [];
}
