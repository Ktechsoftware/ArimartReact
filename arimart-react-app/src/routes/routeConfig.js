// Create this file: src/routes/routeConfig.js
export const routeConfig = {
  "/": { },
  "/home": {  },
  "/onboard": { title: "Welcome" },
  "/auth": { title: "Login" },
  "/about": { title: "About Us" },
  "/contactus": { title: "Contact Us" },
  "/faq": { title: "FAQ" },
  "/privacypolicy": { title: "Privacy Policy" },
  "/topstore/:price": { title: "Top Products" },
  "/notification": { title: "Notifications" },
  "/foryou": { title: "For You" },
  "/home/referandearn": { title: "Refer & Earn" },
  "/home/wallet": { title: "Wallet" },
  "/account": { title: "Account" },
  "/account/editprofile": { title: "Edit Profile" },
  "/explore": { title: "Explore" },
  "/arimartpay": { title: "ArimartPay" },
  "/subcategory/:subcategoryId": { title: "Products" },
  "/cart": { title: "Cart" },
  "/wishlist": { title: "Wishlist" },
  "/promocodes": { title: "Promo Codes" },
  "/checkout": { title: "Checkout" },
  "/orders": { title: "Orders" },
  "/orders/tracking/:trackId": { title: "Track Order" },
  "/orders/track/:trackId": { title: "Track Order" },
  "/checkout/payment": { title: "Payment" },
  "/category": { title: "Categories" },
  "/category/:market/:categoryid": { title: "Products" },
  "/category/:market/subcategory/:subcategoryid": { title: "Products" },
  "/category/:market/:subcategory/product/:id": {  },
  "/category/deals": {  },
  "/search": { title: "Search" },
  "/term&condition": { title: "Terms & Conditions" },
  "/categories": { title: "Categories" },
  "/group-buying": { title: "Group Buying" },
  "/group/join/:groupid/:grouprefercode": { title: "Join Group" },
  "/affiliate": { title: "Affiliate" }
};

// Helper function to match dynamic routes
export const getRouteTitle = (pathname) => {
  // First try exact match
  if (routeConfig[pathname]) {
    return routeConfig[pathname].title;
  }

  // Then try pattern matching for dynamic routes
  for (const [pattern, config] of Object.entries(routeConfig)) {
    if (pattern.includes(':')) {
      const regex = pattern.replace(/:\w+/g, '[^/]+');
      const regexPattern = new RegExp(`^${regex}$`);
      if (regexPattern.test(pathname)) {
        return config.title;
      }
    }
  }

  return "";
};