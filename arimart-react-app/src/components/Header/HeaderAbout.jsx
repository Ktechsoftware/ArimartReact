import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

export default function HeaderAbout() {
  return (
    <header className="top-0 sticky hidden md:block w-full bg-white border-b px-4 py-2 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Amazon" className="h-6" />
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-4 pr-4 py-2 rounded-full border text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Middle: Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-800">
          {[
            "Who We Are",
            "What We Do",
            "Our Workplace",
            "Our Impact",
            "Our Planet",
            "Follow Us"
          ].map((item) => (
            <div className="relative group" key={item}>
              <button className="flex items-center gap-1 hover:text-blue-600 transition">
                {item}
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Dropdowns (optional) */}
              {/* <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 p-3">Dropdown content</div> */}
            </div>
          ))}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          <button className="text-sm hover:text-blue-600">Subscribe</button>
          <div className="flex items-center gap-1">
            <img
              src="https://flagcdn.com/w40/in.png"
              alt="India"
              className="w-5 h-4 object-cover"
            />
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
