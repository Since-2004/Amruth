import { Link } from "react-router-dom";
import llogo from "../assets/Images/llogo.png"

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] backdrop-blur-xl bg-[rgba(5,5,5,0.75)] border-b border-[rgba(220,38,38,0.15)]">
      
      <div className="max-w-7xl mx-auto h-[90px] px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-5 group"
        >
          {/* ICON */}
        <div className="h-20 w-20 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
  
          <img
            src={llogo}
            alt="logo"
            className="w-full h-full object-contain"
          />

        </div>

          {/* TEXT */}
          <div className="flex flex-col justify-center">
            <h1 className="text-white text-lg tracking-[3px] uppercase leading-tight font-bold whitespace-nowrap">
              Amrut Ascend
            </h1>

            <p className="text-[#ef4444] text-[10px] tracking-[5px] uppercase mt-1.5 font-medium whitespace-nowrap">
               Trainer
            </p>
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          
          {[
            "Home",
            "About",
            "Transformations",
            "Programs",
            "Booking",
            "Contact",
            "Client",
            "Owner",
          ].map((item, index) => (
            <Link
              key={index}
              to={
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(/\s+/g, "")}`
              }
              className="text-white hover:text-[#ef4444] transition-all duration-300 text-[11px] xl:text-sm tracking-[1px] uppercase relative group"
            >
              {item}

              <span className="absolute left-0 -bottom-2 w-0 h-[2px] bg-[#dc2626] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* BUTTON */}
        <Link
          to="/booking"
          className="hidden md:flex items-center justify-center px-7 py-3 rounded-full bg-gradient-to-r from-[#7f1d1d] via-[#dc2626] to-[#ef4444] text-white font-semibold uppercase tracking-[2px] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_35px_rgba(220,38,38,0.45)]"
        >
          Book Slot
        </Link>
      </div>
    </header>
  );
}

export default Header;
