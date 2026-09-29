import baseURL from "../assets/baseURL";

// Public VAPID key - safe to ship in frontend source, it's meant to be
// public (pairs with the private key kept server-side in farmbackend's
// VAPID_PRIVATE_KEY env var). Generated via `npx web-push generate-vapid-keys`.
const VAPID_PUBLIC_KEY =
  "BN_9beHRJSu5_aQ3ulgFbybSd_Qa6lJXGnLf1eQ9ZY3uU_PYo5devHVjhUP4rAgMB0DKZQj7UOctkQ_tDAVrLgM";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// "unsupported" | "default" (not yet asked) | "granted" | "denied"
export function getPermissionState() {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

// Requests notification permission - must be called from a user gesture
// (e.g. a button click), most browsers silently ignore/auto-deny it
// otherwise - and, if granted, subscribes this browser to push and saves
// the subscription on the backend so it starts receiving phone
// notifications (with the device's default notification sound). Returns
// true on success.
export async function subscribeToPush() {
  if (!isPushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  await fetch(`${baseURL}push/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  return true;
}
