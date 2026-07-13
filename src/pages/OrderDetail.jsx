import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import API from '../api/axios';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiGift, FiRefreshCw, FiPlay, FiStar } from 'react-icons/fi';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toast';

const STAGE_DELAYS = { Processing: 4000, Shipped: 4000 };

const statusConfig = {
  Processing: { icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Processing' },
  Shipped: { icon: FiTruck, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Shipped' },
  Delivered: { icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Delivered' },
  Cancelled: { icon: FiXCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Cancelled' },
};

const nextStatus = { Processing: 'Shipped', Shipped: 'Delivered' };

const showFeedbackPopup = async (orderId) => {
  let rating = 0;
  const { isConfirmed, value } = await Swal.fire({
    title: 'How was your experience?',
    html: `
      <p style="color:#9ca3af;margin-bottom:12px;font-size:14px;">Rate your order #${orderId.slice(-8)}</p>
      <div id="swal-stars" style="font-size:38px;cursor:pointer;letter-spacing:8px;margin-bottom:16px;">
        ${[1,2,3,4,5].map(i => `<span class="swal-star" data-r="${i}" style="color:#4b5563;transition:color .2s;">★</span>`).join('')}
      </div>
      <textarea id="swal-comment" placeholder="Tell us more about your experience..." style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #374151;background:#1f2937;color:#e5e7eb;min-height:70px;resize:vertical;outline:none;font-size:14px;box-sizing:border-box;"></textarea>
    `,
    showCancelButton: true,
    confirmButtonText: 'Submit Feedback',
    cancelButtonText: 'Skip',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    background: '#111827',
    color: '#e5e7eb',
    didOpen: () => {
      const stars = document.querySelectorAll('.swal-star');
      const highlight = (r) => {
        stars.forEach(s => {
          s.style.color = parseInt(s.dataset.r) <= r ? '#facc15' : '#4b5563';
        });
      };
      stars.forEach(s => {
        const r = parseInt(s.dataset.r);
        s.addEventListener('mouseover', () => highlight(r));
        s.addEventListener('mouseout', () => highlight(rating));
        s.addEventListener('click', () => { rating = r; highlight(rating); });
      });
    },
    preConfirm: () => {
      if (rating === 0) {
        Swal.showValidationMessage('Please select a rating');
        return false;
      }
      return { rating, comment: document.getElementById('swal-comment')?.value || '' };
    },
  });
  if (isConfirmed && value) {
    try { await API.put(`/orders/${orderId}/feedback`, value); } catch (_) {}
    showSuccessToast('Thank you for your feedback!');
  }
};

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
        if (data.status !== 'Delivered' && data.status !== 'Cancelled') {
          setSimulating(true);
        } else if (data.status === 'Delivered' && !data.feedback) {
          setTimeout(() => showFeedbackPopup(id), 1000);
        }
      } catch (err) {
        showErrorToast(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    return () => timers.current.forEach(clearTimeout);
  }, [id]);

  useEffect(() => {
    if (!simulating || !order) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    let current = order.status;
    const advance = () => {
      const next = nextStatus[current];
      if (!next) return;
      API.put(`/orders/${id}/status`, { status: next })
        .then(({ data }) => {
          setOrder(data);
          if (next === 'Shipped') showInfoToast(`Order #${id.slice(-8)} has been shipped!`);
          if (next === 'Delivered') {
            showSuccessToast(`Order #${id.slice(-8)} has been delivered!`);
            setTimeout(() => showFeedbackPopup(id), 1500);
          }
          current = next;
          if (nextStatus[next]) {
            timers.current.push(setTimeout(advance, STAGE_DELAYS[next] || 4000));
          } else {
            setSimulating(false);
          }
        })
        .catch(() => setSimulating(false));
    };
    timers.current.push(setTimeout(advance, STAGE_DELAYS[current] || 4000));
  }, [simulating, order?._id]);

  const getSteps = () => {
    if (order?.status === 'Cancelled') {
      return [
        { label: 'Processing', icon: FiClock, done: true, failed: false },
        { label: 'Cancelled', icon: FiXCircle, done: true, failed: true },
      ];
    }
    return [
      { label: 'Processing', icon: FiClock, done: true },
      { label: 'Shipped', icon: FiTruck, done: order?.status === 'Shipped' || order?.status === 'Delivered' },
      { label: 'Delivered', icon: FiCheckCircle, done: order?.status === 'Delivered' },
    ];
  };

  const steps = getSteps();
  const currentStatus = statusConfig[order?.status] || statusConfig.Processing;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-24 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
        <div className="h-6 bg-gray-800 rounded w-1/4 mb-8" />
        <div className="h-32 bg-gray-800 rounded mb-6" />
        <div className="h-24 bg-gray-800 rounded" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-24 text-center py-20">
        <FiPackage size={64} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg">Order not found</p>
        <Link to="/orders" className="btn-primary inline-block mt-4">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
      <Link to="/orders" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <FiArrowLeft className="mr-2" /> {t('orders.title')}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title !mb-1">{t('orders.track')}</h1>
          <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
        </div>
        <div className="flex items-center space-x-3">
          {simulating && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 animate-pulse">
              Live
            </span>
          )}
          <span className={`text-sm px-3 py-1 rounded-full font-bold ${currentStatus.bg} ${currentStatus.color}`}>
            <currentStatus.icon size={14} className="inline mr-1" />
            {order.status}
          </span>
        </div>
      </div>

      <div className="card p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Tracking Timeline</h3>
          {!simulating && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <button
              onClick={() => setSimulating(true)}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-bold"
            >
              <FiPlay size={14} />
              <span>Simulate</span>
            </button>
          )}
          {!simulating && (
            <button
              onClick={async () => {
                try {
                  const { data } = await API.get(`/orders/${id}`);
                  setOrder(data);
                  showSuccessToast('Order status refreshed');
                } catch (err) {
                  showErrorToast('Failed to refresh');
                }
              }}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-bold"
            >
              <FiRefreshCw size={14} />
              <span>Refresh</span>
            </button>
          )}
        </div>
        <div className="relative">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start mb-0 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 relative transition-all duration-500 ${
                  step.failed ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                  step.done ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  <step.icon size={20} />
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-16 sm:h-20 my-1 transition-colors duration-500 ${
                    steps[i + 1]?.done && !steps[i + 1]?.failed ? 'bg-blue-500' :
                    steps[i + 1]?.failed ? 'bg-red-500' : 'bg-gray-800'
                  }`} />
                )}
              </div>
              <div className="ml-5 pt-2.5">
                <p className={`font-bold text-base ${step.done ? (step.failed ? 'text-red-400' : 'text-white') : 'text-gray-500'}`}>
                  {step.label}
                </p>
                <p className="text-xs mt-0.5">
                  {step.done && !step.failed && i === 0 && order.status === 'Processing' ? (
                    <span className="text-yellow-400">Your order is being prepared</span>
                  ) : step.done && !step.failed && i === 1 && order.status === 'Shipped' ? (
                    <span className="text-blue-400">Your order is on the way!</span>
                  ) : step.done && !step.failed && i === 1 && order.status !== 'Shipped' ? (
                    <span className="text-gray-500">Shipped - in transit</span>
                  ) : step.done && !step.failed && i === 2 && order.status === 'Delivered' ? (
                    <span className="text-green-400">Your order has arrived!</span>
                  ) : step.failed ? (
                    <span className="text-red-400">Order was cancelled</span>
                  ) : !step.done && i === 1 ? (
                    <span className="text-gray-500">Pending - preparing to ship</span>
                  ) : !step.done && i === 2 ? (
                    <span className="text-gray-500">Pending - in transit</span>
                  ) : (
                    <span className="text-gray-500">&nbsp;</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
        {simulating && order.status !== 'Delivered' && (
          <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm font-bold flex items-center">
              <FiRefreshCw className="mr-2 animate-spin" size={16} />
              Tracking is live — status will update automatically in a few seconds...
            </p>
          </div>
        )}
        {order.status === 'Delivered' && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm font-bold flex items-center">
              <FiCheckCircle className="mr-2" size={18} />
              Your order has been delivered successfully!
            </p>
            {!order.feedback && (
              <button
                onClick={() => showFeedbackPopup(id)}
                className="mt-3 text-sm bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <FiStar size={16} />
                <span>Leave Feedback</span>
              </button>
            )}
            {order.feedback && (
              <div className="mt-3 flex items-center space-x-2 text-yellow-400">
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} size={16} className={i <= order.feedback.rating ? 'fill-yellow-400' : ''} />
                ))}
                {order.feedback.comment && (
                  <p className="text-gray-400 text-xs ml-2 italic">"{order.feedback.comment}"</p>
                )}
              </div>
            )}
          </div>
        )}
        {order.status === 'Cancelled' && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm font-bold flex items-center">
              <FiXCircle className="mr-2" size={18} />
              This order was cancelled after processing.
            </p>
          </div>
        )}
      </div>

      <div className="card p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{item.name}</p>
                <p className="text-gray-400 text-sm">{item.qty} x ${item.price}</p>
              </div>
              <p className="text-white font-bold flex-shrink-0">${(item.qty * item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg font-bold text-white mb-3">Shipping Address</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {order.shippingAddress.address}<br />
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg font-bold text-white mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Items</span><span>{order.items.length}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span><span>${order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span><span className="text-green-400">FREE</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold">
              <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          {order.giftCardCode && (
            <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg flex items-center space-x-2">
              <FiGift className="text-yellow-400 flex-shrink-0" />
              <span className="text-yellow-400 text-sm">{t('orders.giftCard')}: {order.giftCardCode}</span>
            </div>
          )}
          {order.returnRequested && (
            <div className="mt-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg">
              <p className="text-red-400 text-sm">{t('orders.return')} - Pending review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
