import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Header from "./Components/Header";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";

import About from "./Pages/About";
import Gallery from "./Pages/Gallery";
import Login from "./Pages/Login";
import Contact from "./Pages/Contact";
import Programs from "./Pages/Programs";
import Checkout from "./Pages/Checkout";
import Transformations from "./Pages/Transformations";
import Hero from "./Pages/Hero";
import Booking from "./Pages/Booking";
import OwnerDashboard from "./Pages/OwnerDashboard";
import ClientDashboard from "./Pages/ClientDashboard";
import { getTheme } from "./lib/api";

function App() {
  useEffect(() => {
    getTheme()
      .then(({ theme }) => {
        document.documentElement.style.setProperty("--brand-primary", theme.primary);
        document.documentElement.style.setProperty("--brand-secondary", theme.secondary);
        document.documentElement.style.setProperty("--brand-surface", theme.surface);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <ScrollToTop />

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<Hero />}/>
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/transformations" element={<Transformations />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
