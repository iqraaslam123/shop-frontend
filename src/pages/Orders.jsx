import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../api/axios';
import { FiPackage, FiChevronRight, FiGift, FiRefreshCw } from 'react-icons/fi';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReturn = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/return`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, returnRequested: true } : o))
      );
      showSuccessToast('Return request submitted');
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Failed to request return');
    }
  };

  const statusColor = {
    Processing: 'text-yellow-400 bg-yellow-400/10',
    Shipped: 'text-blue-400 bg-blue-400/10',
    Delivered: 'text-green-400 bg-green-400/10',
    Cancelled: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">{t('orders.title')}</h1>
        <Link to="/shop" className="btn-outline text-sm">{t('home.viewAll')}</Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-800 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-800 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage size={64} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">{t('orders.empty')}</p>
          <Link to="/shop" className="btn-primary inline-block mt-4">{t('nav.shop')}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm text-gray-400">{t('orders.orderId')}:</span>
                    <span className="text-white font-mono text-sm">#{order._id.slice(-8)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {t('orders.date')}: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t('orders.total')}: <span className="text-white font-bold">${order.totalPrice.toFixed(2)}</span>
                  </p>
                  {order.giftCardCode && (
                    <p className="flex items-center space-x-1 text-sm text-yellow-400 mt-1">
                      <FiGift size={14} />
                      <span>{t('orders.giftCard')}: {order.giftCardCode}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {!order.returnRequested && order.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleReturn(order._id)}
                      className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-1"
                    >
                      <FiRefreshCw size={14} />
                      <span>{t('orders.return')}</span>
                    </button>
                  )}
                  {order.returnRequested && (
                    <span className="text-sm text-yellow-400">Return requested</span>
                  )}
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <span>{t('orders.track')}</span>
                    <FiChevronRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
