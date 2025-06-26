import { useLocation } from "react-router-dom";
import DesktopFooter from "../components/Footer/DesktopFooter";
import DesktopHeader from "../components/Header/DekstopHeader";

export default function WebLayout({ children }) {
  const location = useLocation();

  // Add all routes you want to hide header/footer for
  const hideHeaderFooterRoutes = ["/auth", "/onboard", "/login", "/about","/contactus"];

  // If path matches any in the list
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideHeaderFooter && <DesktopHeader />}
      <main className={`${!shouldHideHeaderFooter ? 'pt-0' : ''} mx-auto`}>{children}</main>
      {!shouldHideHeaderFooter && <DesktopFooter />}
    </>
  );
}
