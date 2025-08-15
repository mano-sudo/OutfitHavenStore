import React from "react";
import Navbar from "./assets/Components/Navbar";
import ImageSlider from "./assets/Pages/Hero";
import Products from "./assets/Pages/Products";
import Footer from "./assets/Components/Footer";
import { Routes, Route } from "react-router-dom";
import Shop from "./assets/Pages/Shop";
import HowToOrder from "./assets/Pages/HowToOrder";
import Contact from "./assets/Pages/Contact";
import Touch from "./assets/Components/Touch";
import Login from "./assets/Pages/Login";
import Signup from "./assets/Pages/Signup";
import { mockProducts } from "./assets/Components/MockProducts";
import Cart from "./assets/Pages/Cart";
import ProductDetail from "./assets/Pages/ProductDetail";
import CheckOut from "./assets/Pages/CheckOut";
import Account from "./assets/Pages/Account";
import PrivateRoute from "./assets/Components/PrivateRoute";
import Category from "./assets/Pages/Category";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar products={mockProducts} />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ImageSlider />
                <div className="pt-20">
                  <Products />
                </div>
              </>
            }
          />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:categoryLink" element={<Category />} />
          <Route path="/how-to-order" element={<HowToOrder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </main>
      <Touch />
      <Footer />
    </div>
  );
};

export default App;
