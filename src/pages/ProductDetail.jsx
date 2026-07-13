import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FiShoppingCart, FiStar, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        const { data: all } = await API.get(`/products?category=${data.category}`);
        setRelated(all.filter((p) => p._id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-800 rounded w-1/4" />
            <div className="h-20 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 text-center">
        <p className="text-gray-400">Product not found</p>
        <Link to="/shop" className="btn-primary inline-block mt-4">Back to Shop</Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <Link to="/shop" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <FiArrowLeft className="mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative group">
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-2xl" />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
              -{discount}% OFF
            </span>
          )}
          {product.isDeal && (
            <span className="absolute top-4 right-4 bg-orange-500 text-white font-bold px-3 py-1 rounded-full text-sm">
              {t('home.sale')}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-blue-400 uppercase tracking-wider">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">{product.name}</h1>
          </div>

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} size={18} />
            ))}
            <span className="text-gray-400 ml-2">({product.numReviews} {t('product.reviews')})</span>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          <p className="text-gray-400 leading-relaxed">{product.description}</p>

          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{t('product.inStock')}: {product.countInStock}</span>
            {product.countInStock > 0 ? (
              <span className="text-green-400 text-sm">{t('product.inStock')}</span>
            ) : (
              <span className="text-red-400 text-sm">{t('product.outOfStock')}</span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center glass rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-gray-300 hover:text-white transition-colors">
                <FiMinus size={16} />
              </button>
              <span className="px-4 text-white font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))} className="p-3 text-gray-300 hover:text-white transition-colors">
                <FiPlus size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={() => addToCart(product._id, product.name, product.image, product.price, qty)}
            disabled={product.countInStock === 0}
            className="btn-primary text-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart />
            <span>{t('product.addToCart')}</span>
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">{t('product.related')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
