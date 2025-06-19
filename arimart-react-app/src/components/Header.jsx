import { Menu, ShoppingCart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import SidebarMenu from "./SidebarMenu";
import logo from '../assets/images/logo.png';
import { Link, useNavigate } from "react-router-dom";

export default function Header({ title, setbaricon = true, setcarticon = true }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-2 m-2 rounded-3xl z-50 bg-transparent shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Icon (Menu or Back) */}
          <div className="w-6 h-6">
            {setbaricon ? (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -m-2">
                <Menu className="w-6 h-6 text-black dark:text-white" />
              </button>
            ) : (
              <button onClick={() => navigate(-1)} 
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                        >
                          <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Center Title/Logo */}
          <h1 className="text-xl font-bold text-black dark:text-white">
            {title ? title : <img src={logo} className="mx-auto w-40" alt="Logo" />}
          </h1>

          {/* Right Icon (Cart or Empty Space) */}
          <div className="w-6 h-6">
            {setcarticon && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-black dark:text-white" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <SidebarMenu open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
}