// Makes right-click "Save image/video as...", drag-to-desktop, and the
// native <video> controls' download button unavailable sitewide.
//
// This is a deterrent, not real protection - anyone who opens devtools,
// views the page source, or just requests the Cloudinary URL directly
// can still get the file. It only stops the casual "right-click save"
// path for regular visitors.
//
// Called once at app startup (see main.jsx) rather than wired into
// every component that renders an <img>/<video>, since those are
// spread across ~60 files with no shared component to patch centrally.

function hardenVideoElement(video) {
  // Chrome/Edge-specific: hides the download icon in the native
  // control bar. Harmless no-op in browsers that don't support it.
  video.setAttribute("controlsList", "nodownload noremoteplayback");
  video.disablePictureInPicture = true;
}

export default function initMediaDownloadProtection() {
  if (typeof document === "undefined") return;

  const isProtectedTarget = (target) =>
    target instanceof HTMLElement && (target.tagName === "IMG" || target.tagName === "VIDEO");

  document.addEventListener("contextmenu", (e) => {
    if (isProtectedTarget(e.target)) {
      e.preventDefault();
    }
  });

  document.addEventListener("dragstart", (e) => {
    if (e.target instanceof HTMLElement && e.target.tagName === "IMG") {
      e.preventDefault();
    }
  });

  // Existing <video> elements (e.g. if this ever runs after first paint).
  document.querySelectorAll("video").forEach(hardenVideoElement);

  // New ones mounted later as the user navigates the SPA.
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "VIDEO") {
          hardenVideoElement(node);
        }
        node.querySelectorAll?.("video").forEach(hardenVideoElement);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
