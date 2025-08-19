import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../common/Header";
import { BottomNavigation } from "../common/BottomNavigation";

const AppLayout = ({ children }) => {
  const location = useLocation();

  // Exact routes to hide
  const exactHiddenRoutes = ["/", "/delivery", "/otp", "/info"];

  // Hide all paths that start with these
  const hiddenPrefixes = ["/info/docs"];

  // Routes shown in BottomNavigation
  const bottomNavRoutes = ["/home", "/orders", "/order/navigate", "/account"];

  // Check if current path should hide UI
  const hideUI =
    exactHiddenRoutes.includes(location.pathname) ||
    hiddenPrefixes.some((prefix) => location.pathname.startsWith(prefix));

  // If the current path doesn't start with any bottom nav path → show back
  const showBack = !bottomNavRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div
      className={`font-sans bg-white text-gray-900 ${
        !hideUI ? "mb-20 md:mb-0" : "min-h-screen "
      }`}
    >
      {!hideUI && <Header title="Arimart" showBack={showBack} />}
      {children}
      {!hideUI && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
