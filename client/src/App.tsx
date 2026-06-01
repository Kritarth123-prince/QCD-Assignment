import React, { useEffect, useState } from 'react';
import { OrdersList } from './OrdersList';

export interface Garment {
  id: string;
  description: string;
  status: 'received' | 'in_cleaning' | 'ready' | 'delivered';
}

export interface Order {
  id: string;
  customerName: string;
  createdAt: string;
  garments: Garment[];
}

export type StatusFilter = 'all' | Garment['status'];

const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'received', label: 'Received' },
  { value: 'in_cleaning', label: 'In Cleaning' },
  { value: 'ready', label: 'Ready for Pickup' },
  { value: 'delivered', label: 'Delivered' },
];

// Human-friendly labels for a garment status, reused for the summary view.
const statusLabel: Record<string, string> = statusFilterOptions.reduce(
  (acc, opt) => (opt.value === 'all' ? acc : { ...acc, [opt.value]: opt.label }),
  {} as Record<string, string>,
);

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [summary, setSummary] = useState<{ [status: string]: number } | null>(
    null,
  );
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3001/api/orders');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as Order[];
        setOrders(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await fetch('http://localhost:3001/api/orders/summary');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as { [status: string]: number };
      setSummary(data);
    } catch (e: any) {
      setSummaryError(e.message || 'Failed to load summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>QDC Mini Dashboard</h1>
      <p>Simple view of active orders and garments.</p>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Filter by status:{' '}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
        >
          {statusFilterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <OrdersList orders={orders} selectedStatus={selectedStatus} />
      )}
      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={fetchSummary} disabled={summaryLoading}>
          {summaryLoading ? 'Loading summary...' : 'Get Summary'}
        </button>
        {summaryError && (
          <p style={{ color: 'red' }}>Error: {summaryError}</p>
        )}
        {summary && !summaryError && (
          <div
            style={{
              marginTop: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '0.75rem',
            }}
          >
            <strong>Garment status summary</strong>
            {Object.keys(summary).length === 0 ? (
              <p style={{ margin: '0.25rem 0 0' }}>No garments to summarize.</p>
            ) : (
              <ul style={{ margin: '0.25rem 0 0' }}>
                {Object.entries(summary).map(([status, count]) => (
                  <li key={status}>
                    {statusLabel[status] ?? status}: {count}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
