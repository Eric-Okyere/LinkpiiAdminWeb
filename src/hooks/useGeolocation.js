import { useEffect, useRef, useState } from "react";

/**
 * Captures the browser's geolocation once on mount, retrying on
 * timeout/unavailable (same pattern CallDriver.jsx already used for
 * its booking modal). Both latitude and longitude stay null until a
 * position resolves, or forever if the user denies the permission
 * prompt or the browser doesn't support it - callers should treat
 * the location as optional.
 *
 * Returns:
 *  - location: { latitude, longitude } - reactive, for UI that should
 *    re-render once the position resolves (e.g. a "location found"
 *    badge).
 *  - getLocation(): () => { latitude, longitude } - reads from a ref,
 *    so handlers created in a closure (like a "Call" button's click
 *    handler) always read the freshest value instead of whatever was
 *    captured when the component first rendered.
 */
export default function useGeolocation() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const locationRef = useRef({ latitude: null, longitude: null });

  useEffect(() => {
    let cancelled = false;

    const fetchLocation = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          const { latitude, longitude } = position.coords;
          locationRef.current = { latitude, longitude };
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          if (
            !cancelled &&
            (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)
          ) {
            setTimeout(fetchLocation, 3000);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    };

    fetchLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  const getLocation = () => locationRef.current;

  return { location, getLocation };
}
