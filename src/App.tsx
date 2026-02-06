import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SingIn/SignIn';
import LogIn from './pages/LogIn/LogIn';
import Product from './pages/Product/Product';
import Header from './components/Header/Header';
import Cart from './pages/Cart/Cart';

const navbarItems = [
  { href: "/log-in", label: "Log In" },
  { href: "/sign-in", label: "Sign In" },
];

function App() {
  const cartItems = [
    { name: "Product 1", price: 10, quantity: 2 },
    { name: "Product 2", price: 15, quantity: 3 },
    { name: "Product 3", price: 8, quantity: 1 },
  ];

  return (
    <Router>
      <Header navbarItems={navbarItems} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart items={cartItems} />} />
      </Routes>
    </Router>
  );
}

export default App;
