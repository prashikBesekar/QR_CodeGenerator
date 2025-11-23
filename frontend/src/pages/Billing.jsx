import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import paymentService from '../services/payment';

const Billing = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await paymentService.getBillingHistory();
        setHistory(res.history || res.invoices || []);
      } catch (err) {
        setError(err.message || 'Failed to load billing history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700">Please sign in to view your billing.</p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner text="Loading billing..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Billing</h1>
        <p className="text-gray-600">Manage your subscription and view invoices.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Billing History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No invoices found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{new Date(inv.date || inv.createdAt || inv.created || Date.now()).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">{inv.description || inv.plan || 'Invoice'}</td>
                    <td className="py-2 pr-4">{inv.amount ? `$${(inv.amount / 100).toFixed(2)}` : '-'}</td>
                    <td className="py-2 pr-4 capitalize">{inv.status || 'paid'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;


