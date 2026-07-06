import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { App as CapApp } from "@capacitor/app";

export const isNative = () => Capacitor.isNativePlatform();

/** Initialize native shell: status bar color, splash hide, Android back button. */
export async function initNative(onBack?: () => boolean | void) {
  if (!isNative()) return;

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#e02020" });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {}

  try {
    await SplashScreen.hide({ fadeOutDuration: 250 });
  } catch {}

  try {
    CapApp.addListener("backButton", ({ canGoBack }) => {
      const handled = onBack?.();
      if (handled) return;
      if (canGoBack) window.history.back();
      else CapApp.exitApp();
    });
  } catch {}
}

/** Light haptic tap — safe no-op on web. */
export async function tapHaptic() {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {}
}

export async function successHaptic() {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {}
}
