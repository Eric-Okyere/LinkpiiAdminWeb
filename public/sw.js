// Service worker for Web Push. Registered from
// src/utils/pushNotifications.js. Plain JS on purpose - served as-is from
// the site root (no bundler runs on this file).

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: "Linkpii", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Linkpii";
  const options = {
    body: data.body || "",
    icon: "/icon.png",
    badge: "/icon.png",
    data: { type: data.type, itemId: data.itemId },
    // No `silent: true` here on purpose - the OS plays its default
    // notification sound for a shown notification unless told not to.
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
        return undefined;
      })
  );
});
