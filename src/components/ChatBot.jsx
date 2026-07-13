import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCpu } from 'react-icons/fi';

const responses = [
  { keywords: ['hello', 'hi', 'hey', 'greetings'], reply: 'Hello! Welcome to ShopVerse. How can I assist you today?' },
  { keywords: ['order', 'track', 'delivery', 'shipping'], reply: 'You can track your orders from the Orders page in your account. Delivery typically takes 3-5 business days.' },
  { keywords: ['return', 'refund', 'exchange'], reply: 'We offer a 30-day return policy. You can initiate a return from your Orders page or visit our Return Policy page.' },
  { keywords: ['payment', 'pay', 'card', 'stripe'], reply: 'We accept all major credit/debit cards via Stripe. Your payment information is encrypted and secure.' },
  { keywords: ['price', 'cost', 'discount', 'deal', 'sale'], reply: 'Check out our Deals page for the latest discounts and promotions! We regularly update our offers.' },
  { keywords: ['size', 'fit', 'measurement'], reply: 'Each product page has a detailed size guide. If you need specific measurements, feel free to contact our support team.' },
  { keywords: ['contact', 'support', 'help', 'phone', 'email'], reply: 'You can reach our support team via email at support@shopverse.com or use the live chat feature.' },
  { keywords: ['shipping', 'free shipping', 'delivery fee'], reply: 'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days.' },
  { keywords: ['account', 'login', 'signup', 'register'], reply: 'You can create an account or login using the Login button in the top navigation bar.' },
  { keywords: ['product', 'item', 'search', 'find'], reply: 'Use the search bar at the top to find products, or browse through our categories: Shop, Makeup, Jewelry, Footwear, and more!' },
];

const getResponse = (message) => {
  const lower = message.toLowerCase();
  for (const item of responses) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.reply;
    }
  }
  return "I'm not sure about that. Please try rephrasing or visit our Help Center for assistance. You can also contact our support team for more specific inquiries.";
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi! I\'m ShopVerse AI assistant. How can I help you?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setTimeout(() => {
      const botReply = getResponse(userMsg);
      setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
        aria-label="Toggle chat"
      >
        {open ? <FiX size={24} className="text-white" /> : <FiMessageSquare size={24} className="text-white" />}
      </button>

      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] max-w-[calc(100vw-2rem)] glass rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <FiCpu size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">ShopVerse AI</p>
            <p className="text-white/70 text-xs">Online • Ready to help</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="h-[350px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-gray-800/80 text-gray-200 rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-gray-700/50 p-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-medium"
          />
          <button
            type="submit"
            className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <FiSend size={14} className="text-white" />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
