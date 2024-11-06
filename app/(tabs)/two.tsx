import { RefreshControl, ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabTwoScreen() {
	const [Asistencia, setAsistencia] = useState<asistencias>({});
  const [refresh, setRefresh] = useState<boolean>(false)
	const fetch = () => {
		AsyncStorage.getItem("Users").then((v) => {
			if (v) {
				const data: asistencias = JSON.parse(v);
				setAsistencia(data);
			}
		});
	};

	useEffect(() => {
		fetch();
	}, []);

	const handlerRefresh = async() => {
    setRefresh(true);
    await fetch();
    setRefresh(false);
  };

	return (
		<ScrollView refreshControl={
      <RefreshControl refreshing={refresh} onRefresh={handlerRefresh}/>
    }>
			<View style={styles.container}>
				{Object.entries(Asistencia).map(([date, names]) => (
					<View key={date}>
						<Text>{date}</Text>
						{names.map((name, index) => (
							<Text key={index}>{name}</Text>
						))}
					</View>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
