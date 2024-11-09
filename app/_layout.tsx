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
import { View, Text, Button, Image, Pressable } from "react-native";
import "react-native-reanimated";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
				<Image source={require("../assets/images/FingerPrint.png")} className="h-60 w-64 m-4" />
				<Pressable className=" flex top-8 items-center justify-around w-auto h-auto" onPress={()=>authenticate()}>
					<Text>Login</Text>
					<MaterialIcons name="fingerprint" size={50} color="black" />
				</Pressable>

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
			value={DefaultTheme}
		>
			<Stack screenOptions={{contentStyle:{backgroundColor:"Transparent"}}}>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }}  />
				<Stack.Screen
					name="modal"
					options={{ presentation: "modal" }}
				/>
			</Stack>
		</ThemeProvider>
	);
}
