import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import { FiLock } from 'react-icons/fi';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [loading, setLoading] = useState(false);

  const subtotal = cart.items?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/orders', { shippingAddress: shipping, paymentMethod: 'Stripe' });
      await fetchCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Shipping Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Address"
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                className="input-field"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Country"
                value={shipping.country}
                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                className="input-field"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <FiLock />
                <span>{loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="card p-6 h-fit">
          <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm line-clamp-1">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.qty} x ${item.price}</p>
                </div>
                <p className="text-white font-semibold text-sm">${(item.qty * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2">
              <span>Total</span><span>${(subtotal + shippingCost).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
