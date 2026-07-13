import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiGlobe, FiLogOut, FiPackage, FiChevronDown } from 'react-icons/fi';
import { showSuccessToast } from '../utils/toast';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [mobileSearch]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
    showSuccessToast(`Language changed to ${lng.toUpperCase()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?keyword=${searchTerm}`);
      setSearchTerm('');
      setMobileSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    showSuccessToast('Logged out successfully');
  };

  const navLinks = [
    { label: t('nav.home'), path: '/', color: 'text-gray-100' },
    { label: t('nav.shop'), path: '/shop', color: 'text-gray-100' },
    { label: t('nav.womensClothing'), path: '/womens-clothing', color: 'text-gray-100' },
    { label: t('nav.makeup'), path: '/makeup', color: 'text-gray-100' },
    { label: t('nav.jewelry'), path: '/jewelry', color: 'text-gray-100' },
    { label: t('nav.footwear'), path: '/footwear', color: 'text-gray-100' },
    { label: t('nav.deals'), path: '/deals', color: 'text-orange-400' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 min-w-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-extrabold text-xs sm:text-base">SV</span>
            </div>
            <span className="hidden xs:inline sm:hidden text-sm font-extrabold text-gradient tracking-tight">SV</span>
            <span className="hidden sm:inline text-xl lg:text-2xl font-extrabold text-gradient tracking-tight">ShopVerse</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('nav.search')}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full px-10 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-medium"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1">
                <FiSearch size={15} />
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg ${link.color} hover:bg-white/10 transition-colors font-bold text-sm tracking-wide`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              className="md:hidden text-gray-300 hover:text-white font-bold p-1"
              aria-label="Toggle search"
            >
              {mobileSearch ? <FiX size={16} /> : <FiSearch size={16} />}
            </button>

            <div className="relative hidden xs:block" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="text-gray-300 hover:text-white flex items-center space-x-0.5 text-sm font-bold p-1"
                aria-label="Select language"
              >
                <FiGlobe size={15} />
                <span className="hidden sm:inline text-xs">{i18n.language.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-3 sm:px-4 py-2 text-sm font-bold transition-colors ${i18n.language === 'en' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => changeLanguage('ur')}
                    className={`w-full text-left px-3 sm:px-4 py-2 text-sm font-bold transition-colors ${i18n.language === 'ur' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    🇵🇰 اردو
                  </button>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative text-gray-300 hover:text-white font-bold p-1">
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-xs rounded-full w-4.5 h-4.5 flex items-center justify-center font-extrabold min-w-[18px] min-h-[18px]">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/orders" className="text-gray-300 hover:text-white hidden sm:block font-bold p-1">
                  <FiPackage size={17} />
                </Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 hidden sm:block font-bold p-1" aria-label="Logout">
                  <FiLogOut size={16} />
                </button>
                <Link to="/profile" className="flex items-center text-sm text-gray-100 font-bold">
                  <FiUser size={16} className="mr-0.5" />
                  <span className="hidden md:inline max-w-[80px] truncate">{user.name}</span>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !px-2 sm:!px-5 !py-1 sm:!py-2 font-bold whitespace-nowrap text-[11px] sm:text-sm">
                {t('nav.login')}
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-gray-300 hover:text-white font-bold p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileSearch && (
        <div className="md:hidden border-t border-gray-800 px-4 py-3 glass">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('nav.search')}
                className="w-full bg-gray-800/80 border border-gray-700 rounded-full px-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-medium"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <FiSearch size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-800 max-h-[calc(100vh-4rem)] overflow-y-auto glass">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-bold ${link.color === 'text-orange-400' ? 'text-orange-400' : 'text-gray-100'} hover:bg-white/5 transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-800 my-2 pt-2">
              <div className="flex items-center space-x-2 px-4 py-2">
                <button
                  onClick={() => { changeLanguage('en'); setMenuOpen(false); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${i18n.language === 'en' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => { changeLanguage('ur'); setMenuOpen(false); }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${i18n.language === 'ur' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  🇵🇰 UR
                </button>
              </div>
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-base font-bold text-gray-100 hover:bg-white/5 transition-colors">
                    <FiPackage className="inline mr-2" size={16} /> {t('nav.orders')}
                  </Link>
                  <Link to="/return-policy" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-base font-bold text-gray-100 hover:bg-white/5 transition-colors">
                    {t('footer.returnPolicy')}
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-lg text-base font-bold text-red-400 hover:bg-white/5 transition-colors">
                    <FiLogOut className="inline mr-2" size={16} /> {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-base font-bold text-blue-400 hover:bg-white/5 transition-colors">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-base font-bold text-gray-100 hover:bg-white/5 transition-colors">
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
