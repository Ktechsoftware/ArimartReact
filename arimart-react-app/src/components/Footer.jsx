import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-indigo-400">Arimart</h3>
            <p className="text-gray-400">
              Your trusted retail partner for quality products at affordable prices.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Electronics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Clothing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Home & Kitchen</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Beauty</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-400 not-italic">
              123 Retail Street<br />
              Shopping District<br />
              City, ST 12345<br />
              <br />
              Email: info@arimart.com<br />
              Phone: (123) 456-7890
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Arimart Retail Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;