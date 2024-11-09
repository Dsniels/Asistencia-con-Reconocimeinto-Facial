import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, SafeAreaView, View } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<SafeAreaView className="flex-1 bg-transparent" >
		<Tabs
		
			screenOptions={{
				tabBarActiveTintColor: Colors["light"].tint,
				headerShown: false,
				tabBarStyle:{
					position:'absolute',
					borderTopRightRadius: 25,
					borderTopLeftRadius:25,
					padding:10,
					height:55,
					

				}
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title:"Reconocimiento",
					tabBarIcon:({ color }) => (
						<TabBarIcon name="camera" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: "Asistencias",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="users" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="registrarAlumno"
				options={{
					title: "Añadir Alumnos",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="user-plus" color={color} />
					),
				}}
			/>
		</Tabs>
		</SafeAreaView>
	);
}
