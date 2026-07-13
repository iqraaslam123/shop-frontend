import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail } from 'react-icons/fi';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900/80 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SV</span>
              </div>
              <span className="text-xl font-bold text-gradient">ShopVerse</span>
            </Link>
            <p className="text-gray-400 text-sm">{t('footer.description')}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/womens-clothing" className="text-gray-400 hover:text-white transition-colors">{t('nav.womensClothing')}</Link></li>
              <li><Link to="/makeup" className="text-gray-400 hover:text-white transition-colors">{t('nav.makeup')}</Link></li>
              <li><Link to="/jewelry" className="text-gray-400 hover:text-white transition-colors">{t('nav.jewelry')}</Link></li>
              <li><Link to="/footwear" className="text-gray-400 hover:text-white transition-colors">{t('nav.footwear')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.customerService')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/return-policy" className="text-gray-400 hover:text-white transition-colors">{t('footer.returnPolicy')}</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.faq')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2"><FiMail size={14} /><span>support@shopverse.com</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ShopVerse. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
