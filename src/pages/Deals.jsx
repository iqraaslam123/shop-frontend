import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FiZap } from 'react-icons/fi';

const Deals = () => {
  const { t } = useTranslation();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products/deals')
      .then((res) => setDeals(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <div className="flex items-center space-x-3 mb-8">
        <FiZap className="text-orange-400" size={32} />
        <h1 className="section-title">{t('nav.deals')}</h1>
      </div>

      <div className="mb-8 glass rounded-2xl p-6">
        <p className="text-gray-300">
          Limited time offers! Grab the best deals before they're gone.
          Free shipping on all orders over $50.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="aspect-square bg-gray-800 rounded-xl mb-4" />
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No deals available right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Deals;
