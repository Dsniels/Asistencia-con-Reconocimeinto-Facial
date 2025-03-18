import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DefaultTheme,
	NavigationContainer,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import {
	View,
	Text,
	Image,
	Pressable,
	ImageSourcePropType,
} from "react-native";
import "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import "../global.css";
import { Asset, useAssets } from "expo-asset";
import { useColorScheme } from "@/components/useColorScheme";
import { Api } from "@/Service/Api/ApiService";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	const [authenticated, setAuthenticated] = useState(false);

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
	const [assets, errorAssets] = useAssets([
		require("../assets/images/FingerPrint.png"),
		require("../assets/images/FingerPrintLogin.png"),
	]);

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
				className="bg-white"
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{assets && (
					<Image
						source={assets[0] as ImageSourcePropType}
						className="h-60 w-64 m-4"
					/>
				)}
				<Pressable
					className=" flex top-8 items-center justify-around w-auto h-auto"
					onPress={() => authenticate()}
				>
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
		<ThemeProvider value={DefaultTheme}>
			<Stack
				screenOptions={{
					contentStyle: { backgroundColor: "Transparent" },
				}}
			>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="modal"
					options={{ presentation: "modal" }}
				/>
			</Stack>
		</ThemeProvider>
	);
}
