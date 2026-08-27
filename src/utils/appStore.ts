/**
 * LUNOVA Official Mobile App Store Configuration & Redirection Utilities
 */

// Official store configuration variables.
// Update these variables with official LUNOVA store URLs when available.
export const LUNOVA_PLAY_STORE_URL = import.meta.env.VITE_ANDROID_PLAY_STORE_URL || 'https://play.google.com/store/apps/details?id=com.lunova.app';
export const LUNOVA_APP_STORE_URL = import.meta.env.VITE_IOS_APP_STORE_URL || 'https://apps.apple.com/app/lunova/id6479821345';

export interface AppDownloadHandlerOptions {
  onDesktopFallback: () => void;
}

export function handleAppDownload(options?: { onDesktopFallback?: () => void }) {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';

  // Detect Android
  if (/android/i.test(userAgent)) {
    window.location.href = LUNOVA_PLAY_STORE_URL;
    return 'android';
  }

  // Detect iOS (iPhone, iPad, iPod)
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    window.location.href = LUNOVA_APP_STORE_URL;
    return 'ios';
  }

  // Desktop or unsupported device fallback -> trigger selection popup
  if (options?.onDesktopFallback) {
    options.onDesktopFallback();
  } else {
    // Default fallback window open or prompt
    window.open(LUNOVA_PLAY_STORE_URL, '_blank');
  }
  return 'desktop';
}
