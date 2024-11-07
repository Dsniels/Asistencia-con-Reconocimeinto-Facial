import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

type asistencias = { [date: string]: string[] };

export default function TabTwoScreen() {
	const [asistencia, setAsistencia] = useState<asistencias>({});
	const [refresh, setRefresh] = useState<boolean>(false);	
	const dates = Object.keys(asistencia)
	const [selectedDate, setSelectedDate] = useState<string>(dates[dates.length-1]);

	const fetch = async () => {
		try {
			const v = await AsyncStorage.getItem("Users");
			if (v) {
				const data: asistencias = JSON.parse(v);
				setAsistencia(data);
			}
		} catch (error) {
			console.error("Error fetching data from AsyncStorage", error);
		}
	};

	useEffect(() => {
		fetch();
	}, []);

	const handlerRefresh = async () => {
		setRefresh(true);
		await fetch();
		setRefresh(false);
	};

	const filteredAsistencia = selectedDate
		? { [selectedDate]: asistencia[selectedDate] || [] }
		: asistencia;

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refresh}
					onRefresh={handlerRefresh}
				/>
			}
		>
			<View className="flex-1 p-5">
				<View className="flex justify-between content-between">
					<Text className="text-white">Fecha:</Text>
					<Picker
						mode="dialog"
						selectedValue={selectedDate}
						onValueChange={(itemValue) =>
							setSelectedDate(itemValue)
						}
						
						style={{ color: "white", width: 25 }}
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
				{Object.entries(filteredAsistencia).map(([date, names]) => (
					<View
						key={date}
						className="mb-5 p-4 bg-gray-200 rounded-lg"
					>
						<Text className="text-lg font-bold mb-2">{date}</Text>
						{names.map((name, index) => (
							<Text key={index} className="text-base ml-2">
								{name}
							</Text>
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
		padding: 20,
	},
	dateContainer: {
		marginBottom: 20,
		padding: 10,
		backgroundColor: "#f0f0f0",
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
