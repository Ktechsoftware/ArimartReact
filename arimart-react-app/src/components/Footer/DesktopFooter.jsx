import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copyright,
  Globe,
} from "lucide-react";

export default function DesktopFooter() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 pt-10 pb-6 text-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 border-b pb-8">
          {/* Useful Links */}
          <div>
            <h4 className="text-base font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-1">
              {[
                "Blog", "Privacy", "Terms", "FAQs", "Security", "Contact",
                "Partner", "Franchise", "Seller", "Warehouse", "Deliver", "Resources",
                "Recipes", "Bistro"
              ].map((item, idx) => (
                <li key={idx} className="hover:text-green-600 cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 lg:col-span-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-semibold">Categories</h4>
              <button className="text-green-600 text-sm font-medium">see all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[
                "Vegetables & Fruits", "Dairy & Breakfast", "Munchies", "Cold Drinks & Juices",
                "Instant & Frozen Food", "Tea, Coffee & Health Drinks", "Bakery & Biscuits",
                "Sweet Tooth", "Atta, Rice & Dal", "Dry Fruits, Masala & Oil", "Sauces & Spreads",
                "Chicken, Meat & Fish", "Paan Corner", "Organic & Premium", "Baby Care",
                "Pharma & Wellness", "Cleaning Essentials", "Home & Office",
                "Ice Creams & Frozen Desserts", "Personal Care", "Pet Care",
                "Beauty & Cosmetics", "Magazines", "Fashion & Accessories",
                "Electronics & Electricals", "Stationery Needs", "Books",
                "Toys & Games", "Print Store", "E-Gift Cards"
              ].map((category, index) => (
                <span key={index} className="text-sm hover:text-green-600 cursor-pointer">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 gap-4">
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 gap-1">
            <Copyright className="w-4 h-4" />
            <span>Arimart Commerce Private Limited, 2016–2025</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm">Download App</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_logo_black.svg/24px-Apple_logo_black.svg.png"
              alt="App Store"
              className="h-6 w-auto"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/200px-Google_Play_Store_badge_EN.svg.png"
              alt="Play Store"
              className="h-6 w-auto"
            />
          </div>

          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin, Globe].map((Icon, idx) => (
              <Icon key={idx} className="h-5 w-5 hover:text-green-600 cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          “Arimart” is owned & managed by "Arimart Commerce Private Limited" and is not related, linked or interconnected in whatsoever manner or nature, to “GROFFR.COM” which is a real estate services business operated by “Redstone Consultancy Services Private Limited”.
        </p>
      </div>
    </footer>
  );
}
