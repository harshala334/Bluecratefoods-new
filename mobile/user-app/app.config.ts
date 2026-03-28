import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Blue Crate",
    slug: "bluecratefoods",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon.png",
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
        image: "./assets/images/app-icon.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.bluecratefoods.app",
        googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon-foreground.png",
            backgroundColor: "#28B7B5"
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
        favicon: "./assets/images/app-icon.png"
    },
    extra: {
        eas: {
            projectId: "41d1bb77-a0a7-4244-92ad-dc61f9150ea3"
        },
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID'
    }
});
