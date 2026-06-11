import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import llogo from "../assets/Images/llogo.png"
import { getOwnerNotifications, markNotificationsRead } from "../lib/api";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Close menu when route changes and check user state
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
    try {
      const u = localStorage.getItem("amrut_user");
      if (u) {
        const parsed = JSON.parse(u);
        setUser(parsed);
        if (parsed.role === "OWNER") {
          getOwnerNotifications()
            .then(data => setNotifications(data.notifications || []))
            .catch(console.error);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("amrut_user");
    localStorage.removeItem("amrut_token");
    setUser(null);
    window.location.href = "/";
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Transformations", path: "/transformations" },
    { label: "Programs", path: "/programs" },
    { label: "Booking", path: "/booking" },
    { label: "Contact", path: "/contact" },
  ];

  if (!user) {
    navItems.push({ label: "Login", path: "/login" });
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[1000] backdrop-blur-xl bg-[rgba(5,5,5,0.75)] border-b border-[rgba(220,38,38,0.15)]">
        
        <div className="max-w-7xl mx-auto h-[80px] md:h-[90px] px-6 lg:px-8 flex items-center justify-between">
          
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 md:gap-5 group relative z-50"
          >
            {/* ICON */}
          <div className="h-14 w-14 md:h-20 md:w-20 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
    
            <img
              src={llogo}
              alt="logo"
              className="w-full h-full object-contain"
            />

          </div>

            {/* TEXT */}
            <div className="flex flex-col justify-center">
              <h1 className="text-white text-base md:text-lg tracking-[3px] uppercase leading-tight font-bold whitespace-nowrap">
                Amrut Ascend
              </h1>

              <p className="text-[var(--brand-secondary)] text-[9px] md:text-[10px] tracking-[4px] md:tracking-[5px] uppercase mt-1 md:mt-1.5 font-medium whitespace-nowrap">
                 Trainer
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-8">
            
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-white hover:text-[var(--brand-secondary)] transition-all duration-300 text-xs 2xl:text-sm tracking-[1.5px] uppercase relative group"
              >
                {item.label}

                <span className="absolute left-0 -bottom-2 w-0 h-[2px] bg-[var(--brand-primary)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* DESKTOP BUTTON & MOBILE TOGGLE */}
          <div className="flex items-center gap-4 relative z-50">
            {user?.role === "OWNER" && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-white hover:text-[var(--brand-secondary)] transition-colors text-xl relative mt-2"
                >
                  <FaBell />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--brand-secondary)] rounded-full border border-black"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 bg-[#0b0b0b] border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black">
                      <h3 className="text-white font-bold text-sm tracking-[1px] uppercase">Notifications</h3>
                      <button 
                        onClick={async () => {
                          await markNotificationsRead();
                          const data = await getOwnerNotifications();
                          setNotifications(data.notifications || []);
                        }}
                        className="text-xs text-[var(--brand-secondary)] hover:text-white transition-colors"
                      >
                        Mark Read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-gray-500 text-center">No notifications.</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-semibold text-white">{n.title}</p>
                              {!n.read && <span className="w-1.5 h-1.5 bg-[var(--brand-secondary)] rounded-full"></span>}
                            </div>
                            <p className="text-xs text-gray-400">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="hidden xl:flex items-center justify-center px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold uppercase tracking-[1.5px] transition-all duration-300 hover:border-[var(--brand-primary)] hover:text-[var(--brand-secondary)]"
              >
                Logout
              </button>
            )}
            <Link
              to="/booking"
              className="hidden md:flex items-center justify-center px-6 py-2.5 md:px-7 md:py-3 rounded-full bg-gradient-to-r from-[#7f1d1d] via-[var(--brand-primary)] to-[var(--brand-secondary)] text-white text-sm md:text-base font-semibold uppercase tracking-[2px] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_35px_rgba(220,38,38,0.45)]"
            >
              Book Slot
            </Link>
            
            {/* MOBILE MENU TOGGLE */}
            <button 
              className="xl:hidden text-white text-2xl p-2 hover:text-[var(--brand-secondary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/95 backdrop-blur-3xl z-[999] xl:hidden flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-full invisible'}`}
      >
        <nav className="flex flex-col items-center gap-6 text-center mt-20">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="text-white hover:text-[var(--brand-secondary)] transition-colors text-xl tracking-[3px] uppercase font-medium"
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-[var(--brand-primary)] transition-colors text-xl tracking-[3px] uppercase font-medium"
            >
              Logout
            </button>
          )}
          <Link
            to="/booking"
            className="mt-4 inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-[#7f1d1d] via-[var(--brand-primary)] to-[var(--brand-secondary)] text-white font-bold uppercase tracking-[2px] shadow-[0_10px_35px_rgba(220,38,38,0.25)]"
          >
            Book Slot
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Header;
