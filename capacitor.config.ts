import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "Bricoscan",
  webDir: "www",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff", // Bianco
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
