import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation (it's a SPA -
// no real page load), so clicking a product from partway down a long
// listing page used to open its detail page still scrolled down. This
// jumps the window to the top on every route change so a detail page
// always opens from the top.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
