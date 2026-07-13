import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import API from '../api/axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ThreeScene from '../components/ThreeScene';
import TestimonialsSection from '../components/TestimonialsSection';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiZap, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';

const Home = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const sliderRef = useRef(null);
  const sectionRef = useRef(null);
  const autoTimer = useRef(null);

  const features = [
    { icon: FiZap, title: 'Fast Delivery', desc: 'Free shipping on orders over $50' },
    { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: FiTruck, title: 'Free Returns', desc: '30-day return policy' },
    { icon: FiRefreshCw, title: '24/7 Support', desc: 'Dedicated customer service' },
  ];

  useEffect(() => {
    API.get('/products').then((res) => setProducts(res.data.slice(0, 4)));
    API.get('/products/deals').then((res) => setDeals(res.data.slice(0, 4)));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stopAutoSlide = useCallback(() => {
    if (autoTimer.current) { clearInterval(autoTimer.current); autoTimer.current = null; }
  }, []);

  const startAutoSlide = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      setSlideIndex((prev) => {
        const next = (prev + 1) % features.length;
        sliderRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        return next;
      });
    }, 3000);
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  const goToSlide = (idx) => {
    stopAutoSlide();
    setSlideIndex(idx);
    sliderRef.current?.children[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setTimeout(startAutoSlide, 5000);
  };

  const slideLeft = () => goToSlide(Math.max(0, slideIndex - 1));
  const slideRight = () => goToSlide(Math.min(features.length - 1, slideIndex + 1));

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const idx = Math.round(sliderRef.current.scrollLeft / (sliderRef.current.scrollWidth / features.length));
    setSlideIndex(Math.min(idx, features.length - 1));
  };

  return (
    <div>
      <section className="relative">
        <ThreeScene />
        <Hero />
      </section>

      <section
        ref={sectionRef}
        className={`relative max-w-7xl mx-auto px-4 -mt-12 z-10 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="relative group">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
            className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {features.map((feat, i) => (
              <div key={i} className="snap-center shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)]">
                <div className="glass rounded-2xl p-4 md:p-6 text-center hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all h-full">
                  <feat.icon className="mx-auto text-blue-400 mb-2" size={24} />
                  <h3 className="text-white font-semibold text-sm md:text-base">{feat.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={slideLeft}
            className="absolute left-1 md:left-0 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 transition-all shadow-lg"
          >
            <FiChevronLeft size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
          <button
            onClick={slideRight}
            className="absolute right-1 md:right-0 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 transition-all shadow-lg"
          >
            <FiChevronRight size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4 md:mt-5">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === slideIndex ? 'w-6 bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </section>

      {deals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">{t('home.deals')}</h2>
            <Link to="/deals" className="btn-outline text-sm flex items-center space-x-1">
              <span>{t('home.viewAll')}</span>
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">{t('home.featured')}</h2>
          <Link to="/shop" className="btn-outline text-sm flex items-center space-x-1">
            <span>{t('home.viewAll')}</span>
            <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
};

export default Home;
