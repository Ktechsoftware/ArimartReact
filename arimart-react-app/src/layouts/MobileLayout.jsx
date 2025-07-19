import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import BottomNav from '../components/BottomNav';

export default function MobileLayout({ children }) {
  const location = useLocation();

  // Map pathnames to titles
  const getTitle = (path) => {
    if (path.startsWith("/explore")) return "Explore";
    if (path.startsWith("/cart")) return "Cart";
    if (path.startsWith("/account")) return "Account";
    if (path.startsWith("/orders")) return "Orders";
    if (path.startsWith("/home")) return "Home";
    if (path.startsWith("/wishlist")) return "Wishlist";
    if (path.startsWith("/categories")) return "Categories";
    if (path.startsWith("/foryou")) return "For You";
    if (path.startsWith("/product")) return "Product";
    if (path.startsWith("/checkout")) return "Checkout";
    return ""; // default no title
  };
  const hideBottomNavRoutes = ['/onboard', '/auth'];
  const shouldHideBottomNav = hideBottomNavRoutes.includes(location.pathname);
  // const hideBottomNavRoutesWithPrefix = ['/product', '/orders','/topstore'];

  // const shouldHideBottomNav =
  //   hideBottomNavRoutes.includes(location.pathname) ||
  //   hideBottomNavRoutesWithPrefix.some(prefix => location.pathname.startsWith(prefix));


  // const title = getTitle(location.pathname);

  return (
    <>
      <main className="mb-20 md:mb-2">{children}</main>
       {!shouldHideBottomNav && <BottomNav />}
    </>
  );
}
