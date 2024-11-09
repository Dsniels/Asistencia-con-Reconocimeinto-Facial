import {
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

type asistencias = { [group: string]: { [date: string]: string[] } };

export default function TabTwoScreen() {
	const [asistencia, setAsistencia] = useState<asistencias>({});
	const [refresh, setRefresh] = useState<boolean>(false);
	const groups = Object.keys(asistencia);
	const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]);
	const dates = selectedGroup
		? Object.keys(asistencia[selectedGroup] || {})
		: [];
	const [selectedDate, setSelectedDate] = useState<string>(
		dates[dates.length - 1]
	);

	const fetch = async () => {
		try {
			const v = await AsyncStorage.getItem("Users2");
			if (v) {
				const data: asistencias = JSON.parse(v);
				setAsistencia(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetch();
	}, []);

	useEffect(() => {
		if (groups.length > 0) {
			setSelectedGroup(groups[0]);
		}
	}, [asistencia]);

	useEffect(() => {
		if (dates.length > 0) {
			setSelectedDate(dates[dates.length - 1]);
		}
	}, [selectedGroup]);

	const handlerRefresh = async () => {
		setRefresh(true);
		await fetch();
		setRefresh(false);
	};

	const filteredAsistencia =
		selectedGroup && selectedDate
			? { [selectedDate]: asistencia[selectedGroup][selectedDate] || [] }
			: {};

	return (
		<SafeAreaView className="flex-1 p-3 pt-6  mt-8 rounded-2xl">
			<ScrollView 
				refreshControl={
					<RefreshControl
						refreshing={refresh}
						onRefresh={handlerRefresh}
					/>
				}
			>
				<View className="flex-1 m-3 shadow-md shadow-cyan-900  p-5 rounded-3xl">
                    <Text className="text-base font-semibold">Filtros:</Text>
                    <View className="items-center content-between justify-center">
                        <View className="flex-row items-center  mb-2">
						<Text className="text-black text-lg mr-4">Grupo:</Text>
						<Picker
							mode="dialog"
							selectedValue={selectedGroup}
							onValueChange={(itemValue) =>
								setSelectedGroup(itemValue)
							}
							style={styles.picker}
						>
							{groups.map(
								(group) =>
									group && (
										<Picker.Item
											key={group}
											label={group}
											value={group}
										/>
									)
							)}
						</Picker>
					</View>
					<View className="flex-row  items-center mb-5">
						<Text className="text-black  text-lg mr-4">Fecha:</Text>
						<Picker
							mode="dialog"
							selectedValue={selectedDate}
							onValueChange={(itemValue) =>
								setSelectedDate(itemValue)
							}
							style={styles.picker}
						>
							{dates.map(
								(date) =>
									date && (
										<Picker.Item
											key={date}
											label={date}
											value={date}
										/>
									)
							)}
						</Picker>
					</View>

                    </View>
					
				</View>
				<View className="flex-1 p-5 m-3 mt-4 mb-9  shadow-xl shadow-cyan-900 min-h-32 rounded-3xl">
                    <Text className="text-base font-semibold">Alumnos:</Text>
					{asistencia &&
						Object.entries(filteredAsistencia).map(
							([date, names]) => (
								<View key={date} style={styles.dateContainer}>
									{names.map((name, index) => (
										<Text
											key={index}
											className="text-lg m-2 ml-4"
										>
											{name}
										</Text>
									))}
								</View>
							)
						)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	label: {
		color: "black",
		marginRight: 10,
	},
	picker: {
		color: "black",
		width: 200,
	},
	dateContainer: {
		marginBottom: 20,
		padding: 10,
		borderRadius: 10,
	},
	dateText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	nameText: {
		fontSize: 16,
		marginLeft: 10,
	},
});
