import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// GoatCounter counts the first page load itself; count later page changes, which don't reload the page
export default function PageViews() {
  const { pathname } = useLocation();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    window.goatcounter?.count?.({ path: `${import.meta.env.BASE_URL}${pathname.slice(1)}` });
  }, [pathname]);

  return null;
}
