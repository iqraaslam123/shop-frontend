import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { showSuccessToast } from '../utils/toast';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="card group">
      <Link to={`/product/${product._id}`} className="relative overflow-hidden aspect-square block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.isDeal && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t('home.sale')}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product._id, product.name, product.image, product.price);
            }}
            className="w-full btn-primary text-sm flex items-center justify-center space-x-2"
          >
            <FiShoppingCart />
            <span>{t('product.addToCart')}</span>
          </button>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
        <Link to={`/product/${product._id}`} className="text-white font-semibold hover:text-blue-400 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center space-x-1 mt-1">
          <FiStar size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-400">{product.rating} ({product.numReviews})</span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xl font-bold text-white">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
