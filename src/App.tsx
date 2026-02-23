import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Product from './pages/Product/Product';
import ProductDetail from './pages/Product/ProductDetail';
import Header from './components/Header/Header';
import { CartProvider } from './hooks/CartContext';
import Cart from './pages/Cart/Cart';
import CartConfirmationPage from './pages/Cart/CartConfirmationPage';
import OrderSuccessPage from './pages/Order/OrderSuccessPage';
import BurguerButton from './components/BurguerButton/BurguerButton';
import AsideHeader from './components/AsideHeader/AsideHeader';

const navbarItems = [
  { href: "/auth", label: "Iniciar Sesión" },
];

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

 

  const asideClassName = isOpen ? "aside-header fixed top-0 left-0 bg-white z-10 w-full transition-all duration-300 ease-in-out h-screen" : "aside-header fixed top-0 left-[-100%] bg-white z-10 w-full transition-all duration-300 ease-in-out h-screen";

  return (
    <CartProvider>
      <Router>
        <Header navbarItems={navbarItems} />
        <BurguerButton onClick={toggleOpen} isOpen={isOpen} />
        <aside className={asideClassName}>
          <AsideHeader onAction={toggleOpen}/>
        </aside>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/confirmation" element={<CartConfirmationPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;