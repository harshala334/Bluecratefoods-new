import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Blue Crate",
    slug: "bluecratefoods",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/new_logo.png",
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
        image: "./assets/images/new_logo.png",
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
            foregroundImage: "./assets/images/new_logo.png",
            backgroundColor: "#ffffff"
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
        favicon: "./assets/images/new_logo.png"
    },
    extra: {
        eas: {
            projectId: "41d1bb77-a0a7-4244-92ad-dc61f9150ea3"
        }
    }
});
