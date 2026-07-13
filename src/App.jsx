import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Deals from './pages/Deals';
import ReturnPolicy from './pages/ReturnPolicy';
import WomensClothing from './pages/WomensClothing';
import Makeup from './pages/Makeup';
import Jewelry from './pages/Jewelry';
import Footwear from './pages/Footwear';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/womens-clothing" element={<WomensClothing />} />
              <Route path="/makeup" element={<Makeup />} />
              <Route path="/jewelry" element={<Jewelry />} />
              <Route path="/footwear" element={<Footwear />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
