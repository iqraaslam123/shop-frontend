import { useTranslation } from 'react-i18next';
import { FiRefreshCw, FiShield, FiClock, FiMessageCircle } from 'react-icons/fi';

const ReturnPolicy = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: FiMessageCircle, title: 'Contact Support', desc: 'Reach out to our support team via email or live chat.' },
    { icon: FiRefreshCw, title: 'Initiate Return', desc: 'Fill out the return request form with your order details.' },
    { icon: FiShield, title: 'Ship It Back', desc: 'Pack the items securely and ship them back to us free of charge.' },
    { icon: FiClock, title: 'Get Refunded', desc: 'We process refunds within 5-7 business days after receiving your return.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24">
      <h1 className="section-title mb-4">{t('returnPolicy.title')}</h1>
      <p className="text-gray-400 mb-12">{t('returnPolicy.content')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {steps.map((step, i) => (
          <div key={i} className="card p-6 flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <step.icon className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-gray-300">
          Need help? Contact us at <span className="text-blue-400">support@shopverse.com</span>
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;
