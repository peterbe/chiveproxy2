export function useIsSafari() {
  const ua = navigator.userAgent.toLowerCase();
  const vendor = navigator.vendor.toLowerCase();

  // Chrome and other Chromium browsers contain 'safari' but their vendor is 'Google Inc.'
  // Genuine Safari contains 'safari' and its vendor is 'apple computer, inc.'
  const isGenuineSafari = ua.includes("safari") && vendor.includes("apple");

  return isGenuineSafari;
}
