import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo, memo } from "react";
import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav";
import { getRouteTitle } from "../routes/routeConfig";

const MobileLayout = memo(({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  const { title, headerOptions, shouldHideBottomNav, shouldHideHeader } = useMemo(() => {
    const path = location.pathname;

    const getTitle = () => getRouteTitle(path);

    const getHeaderOptions = (path) => {
      let options = {
        setbaricon: false,
        setcarticon: true,
        showGroupCart: true
      };

      if (path.startsWith("/auth") || path.startsWith("/onboard")) {
        options = { setbaricon: false, setcarticon: false, showGroupCart: false };
      }
      if (path.startsWith("/cart")) {
        options.showGroupCart = false;
        options.setcarticon = false;
      }
      if (path === "/" || path === "/home") {
        options.setbaricon = true;
      }
      return options;
    };

    const hideHeaderRoutes = ['/onboard', '/auth'];
    const shouldHideHeader = hideHeaderRoutes.some(route => path.startsWith(route));

    const hideBottomNavRoutes = ['/onboard', '/auth'];
    let shouldHideBottomNav = hideBottomNavRoutes.some(route => path.startsWith(route));

    // Hide bottom nav for category product pages (but not category listing)
    if (path.startsWith('/category/') && path !== '/category') {
      shouldHideBottomNav = true;
    }

    return {
      title: getTitle(),
      headerOptions: getHeaderOptions(path),
      shouldHideBottomNav,
      shouldHideHeader
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {!shouldHideHeader && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900">
          <Header
            title={title}
            setbaricon={headerOptions.setbaricon}
            setcarticon={headerOptions.setcarticon}
            showGroupCart={headerOptions.showGroupCart}
          />
        </div>
      )}

      <main
        className={`flex-1 ${shouldHideHeader ? "" : "pt-16"} ${location.pathname !== "/auth" ? "pb-20" : "" } ${location.pathname !== "/home" && location.pathname !== "/" ? "overflow-x-hidden" : ""
          }`}
      >
        {children}
      </main>


      {!shouldHideBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <BottomNav />
        </div>
      )}
    </div>
  );
});

MobileLayout.displayName = 'MobileLayout';
export default MobileLayout;
