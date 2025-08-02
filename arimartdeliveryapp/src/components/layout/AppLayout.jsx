import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../common/Header";
import { BottomNavigation } from "../common/BottomNavigation";

const AppLayout = ({ children }) => {
  const location = useLocation();

  // Routes where we hide both header and bottom nav
  const hiddenRoutes = [
    "/", "/delivery", "/otp",
    "/info", "/info/docs",
    "/info/docs/upload", "/info/docs/register","/info/docs/upload/aadhar"
  ];

  // Routes shown in BottomNavigation
  const bottomNavRoutes = [
    "/home",
    "/orders",
    "/order/navigate",
    "/account"
  ];

  const hideUI = hiddenRoutes.includes(location.pathname);

  // If the current path doesn't start with any bottom nav path → show back
  const showBack = !bottomNavRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div
      className={`min-h-screen font-sans bg-white text-gray-900 ${
        !hideUI ? "mb-20 md:mb-0" : ""
      }`}
    >
      {!hideUI && <Header title="Arimart" showBack={showBack} />}
      {children}
      {!hideUI && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
