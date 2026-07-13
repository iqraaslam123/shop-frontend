import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    title: 'Premium Wireless Audio',
    subtitle: 'Experience sound like never before',
    cta: 'Shop Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
    gradient: 'from-blue-600/20 to-purple-600/20',
  },
  {
    title: 'Smart Living Starts Here',
    subtitle: 'Discover the latest in smart technology',
    cta: 'Explore Now',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
    gradient: 'from-purple-600/20 to-pink-600/20',
  },
  {
    title: 'Summer Fashion Collection',
    subtitle: 'Trending styles for every occasion',
    cta: 'Shop Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200',
    gradient: 'from-orange-600/20 to-red-600/20',
  },
];

const Hero = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] min-h-[400px] sm:min-h-[500px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        >
          <div className="absolute inset-0 hero-gradient" />
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center pt-12 sm:pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
              <div className={`max-w-lg transition-all duration-700 delay-200 ${i === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">{slide.title}</h1>
                <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-8">{slide.subtitle}</p>
                <div className="flex flex-wrap gap-3 sm:space-x-4">
                  <Link to="/shop" className="btn-primary text-sm sm:text-lg !px-4 sm:!px-6">{t('hero.cta')}</Link>
                  <Link to="/deals" className="btn-outline text-sm sm:text-lg !px-4 sm:!px-6">{t('hero.learnMore')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={prev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all">
        <FiChevronLeft size={18} className="sm:w-6 sm:h-6" />
      </button>
      <button onClick={next} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all">
        <FiChevronRight size={18} className="sm:w-6 sm:h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'w-8 bg-blue-500' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
