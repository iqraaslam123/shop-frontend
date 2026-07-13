import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { t } = useTranslation();
  const { cart, updateQty, removeFromCart } = useCart();

  const subtotal = cart.items?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;
  const shipping = subtotal > 50 ? 0 : 9.99;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 text-center">
        <FiShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('cart.empty')}</h2>
        <Link to="/shop" className="btn-primary inline-block mt-4">{t('cart.continueShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <h1 className="section-title mb-8">{t('cart.title')} ({cart.items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card p-4 flex items-center space-x-4">
              <Link to={`/product/${item.product?._id || item.product}`}>
                <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product?._id || item.product}`} className="text-white font-semibold hover:text-blue-400 transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-blue-400 font-bold mt-1">${item.price}</p>
              </div>
              <div className="flex items-center glass rounded-full">
                <button onClick={() => updateQty(item.product?._id || item.product, Math.max(1, item.qty - 1))} className="p-2 text-gray-300 hover:text-white">
                  <FiMinus size={14} />
                </button>
                <span className="px-3 text-white font-semibold text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.product?._id || item.product, item.qty + 1)} className="p-2 text-gray-300 hover:text-white">
                  <FiPlus size={14} />
                </button>
              </div>
              <p className="text-white font-bold w-20 text-right">${(item.price * item.qty).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.product?._id || item.product)} className="text-red-400 hover:text-red-300 transition-colors">
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h3 className="text-xl font-bold text-white mb-4">{t('cart.total')}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>{t('cart.subtotal')}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
              <span>{t('cart.total')}</span>
              <span>${(subtotal + shipping).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-center mt-6 block">
            {t('cart.checkout')}
          </Link>
          <Link to="/shop" className="btn-outline w-full text-center mt-3 block text-sm flex items-center justify-center space-x-2">
            <FiArrowLeft />
            <span>{t('cart.continueShopping')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
