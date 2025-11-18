export default {
  expo: {
    name: "Tigo Conecta",
    slug: "tigo-conecta",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      resizeMode: "contain",
      backgroundColor: "#0057e6"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tigo.conecta"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#0057e6"
      },
      package: "com.tigo.conecta",
      permissions: ["android.permission.POST_NOTIFICATIONS"]
    },
    web: {},
    plugins: [
      "expo-notifications"
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "tu-project-id"
      }
    }
  }
};