import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Blue Crate",
    slug: "bluecratefoods",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    jsEngine: "hermes",
    plugins: [
        [
            "expo-build-properties",
            {
                android: {
                    enableProGuardInReleaseBuilds: false,
                    extraProguardRules: "-keep class com.facebook.hermes.unicode.** { *; } -keep class com.facebook.jni.** { *; }",
                    packagingOptions: {
                        pickFirsts: [
                            "**/libhermes.so",
                            "**/libc++_shared.so",
                            "**/libreactnativejni.so",
                            "**/libjscexecutor.so"
                        ]
                    }
                }
            }
        ],
        "expo-font",
        "expo-video"
    ],
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#28b7b5"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.bluecratefoods.app",
        googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#28b7b5"
        },
        package: "com.bluecratefoods.app",
        googleServicesFile: "./google-services.json",
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_MAPS_API_KEY
            }
        }
    },
    web: {
        favicon: "./assets/favicon.png"
    },
    extra: {
        eas: {
            projectId: "7664e924-4ca6-4eaa-9968-15b485d62b3b"
        }
    }
});
