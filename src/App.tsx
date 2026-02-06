import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Product from './pages/Product/Product';
import ProductDetail from './pages/Product/ProductDetail';
import Header from './components/Header/Header';
import Cart from './pages/Cart/Cart';
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

  const cartItems = [
     { id: '1', name: 'Product 1', description: 'Description 1', price: 10, stock: 2, active: true, createdAt: '2022-01-01T00:00:00Z', updatedAt: '2022-01-01T00:00:00Z', image: '/sofkify_generic_product.png' },
    { id: '2', name: 'Product 2', description: 'Description 2', price: 15, stock: 3, active: true, createdAt: '2022-01-01T00:00:00Z', updatedAt: '2022-01-01T00:00:00Z', image: '/sofkify_generic_product.png' },
    { id: '3', name: 'Product 3', description: 'Description 3', price: 20, stock: 5, active: true, createdAt: '2022-01-02T00:00:00Z', updatedAt: '2022-01-02T00:00:00Z', image: '/sofkify_generic_product.png' },
  ]

  const asideClassName = isOpen ? "aside-header fixed top-0 left-0 bg-white z-10 w-full transition-all duration-300 ease-in-out h-screen" : "aside-header fixed top-0 left-[-100%] bg-white z-10 w-full transition-all duration-300 ease-in-out h-screen";

  return (
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
        <Route path="/cart" element={<Cart items={cartItems} />} />
      </Routes>
    </Router>
  );
};

export default App;