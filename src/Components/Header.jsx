import { Link } from "react-router-dom";
import llogo from "../assets/Images/llogo.jpeg"

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] backdrop-blur-xl bg-[rgba(5,5,5,0.75)] border-b border-[rgba(220,38,38,0.15)]">
      
      <div className="max-w-7xl mx-auto h-[60px] px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-4 group"
        >
          {/* ICON */}
        <div className="w-12 h-12 rounded-full overflow-hidden  flex items-center justify-center  transition-all duration-300 group-hover:scale-110">
  
  <img
    src={llogo}
    alt="logo"
    className="w-full h-full object-cover"
  />

</div>

          {/* TEXT */}
          <div>
            <h1 className="text-white text-2xl tracking-[2px] uppercase leading-none font-[Bebas_Neue]">
              Amrut Ascend
            </h1>

            <p className="text-[#ef4444] text-xs tracking-[4px] uppercase mt-1">
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
