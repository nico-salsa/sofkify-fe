import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SingIn/SignIn';
import LogIn from './pages/LogIn/LogIn';
import Product from './pages/Product/Product';
import Header from './components/Header/Header';
import Cart from './pages/Cart/Cart';

const navbarItems = [
  { href: "/", label: "Home" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/log-in", label: "Log In" },
  { href: "/product", label: "Product" }
];

function App() {
  const cartItems = [
    { name: "Product 1", price: 10, quantity: 2 },
    { name: "Product 2", price: 15, quantity: 3 },
    { name: "Product 3", price: 8, quantity: 1 },
  ];

  return (
    <Router>
       <div> 
       <Header navbarItems={navbarItems}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart items={cartItems} />} />
          <Route path="*" element={<h1>Error 404</h1>} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;