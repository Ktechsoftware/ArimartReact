// AppLayout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../common/Header";
import { BottomNavigation } from "../common/BottomNavigation";

const AppLayout = ({ children }) => {
  const location = useLocation();

  // Routes where Header and BottomNavigation should be hidden
  const hiddenRoutes = [
    "/delivery",
    "/otp",
    "/info",
    "/info/docs",
    "/info/docs/upload",
    "/info/docs/register"
  ];

  // Also support dynamic route like /info/docs/upload/:type
  const isHidden = hiddenRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900 mb-20">
      {!isHidden && <Header title="Arimart" />}
      {children}
      {!isHidden && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
