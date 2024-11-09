import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { View, Text, Button } from "react-native";
import "react-native-reanimated";

import "../global.css";

import { useColorScheme } from "@/components/useColorScheme";
import { Api } from "@/Service/Api/ApiService";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	const [authenticated, setAuthenticated] = useState(false);

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);
	const authenticate = async () => {
		const hasHardware = await LocalAuthentication.hasHardwareAsync();
		const isEnrolled = await LocalAuthentication.isEnrolledAsync();
		if (hasHardware && isEnrolled) {
			const result = await LocalAuthentication.authenticateAsync();
			if (result.success) {
				setAuthenticated(true);
			}
		}
	};

	useEffect(() => {
		authenticate();
	}, []);

	useEffect(() => {
		Api.getStatus();
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!authenticated) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				
				<Button
					title="Ingresar"
					onPress={() => authenticate()}
				/>
			</View>
		);
	}

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="modal"
					options={{ presentation: "modal" }}
				/>
			</Stack>
		</ThemeProvider>
	);
}
