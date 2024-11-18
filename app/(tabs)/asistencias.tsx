import {
	Modal,
	Pressable,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
} from "react-native";
import { View } from "@/components/Themed";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import ModalScreen from "../modal";
import { saveData, StorageService } from "@/Service/StorageService";

type asistencias = { [group: string]: { [date: string]: string[] } };

export default function TabTwoScreen() {
	const [asistencia, setAsistencia] = useState<asistencias>({});
	const [refresh, setRefresh] = useState<boolean>(false);
	const groups = Object.keys(asistencia) || [];
	const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]);
	const dates = selectedGroup
		? Object.keys(asistencia[selectedGroup] || {})
		: [];
	const [selectedDate, setSelectedDate] = useState<string>(
		dates[dates.length - 1] || ""
	);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [selectedName, setSelectedName] = useState<string>("");
	const [isModalVisible, setIsModalVisible] = useState(false);

	const fetch = async () => {
		try {
			const v = await AsyncStorage.getItem("Users2");
			if (v) {
				const data: asistencias = JSON.parse(v);
				setAsistencia(data);
			} else {
				setAsistencia({});
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
		} else {
			setSelectedGroup("");
		}
	}, [asistencia]);

	useEffect(() => {
		if (dates.length > 0) {
			setSelectedDate(dates[dates.length - 1]);
		} else {
			setSelectedDate("");
		}
	}, [selectedGroup]);

	const handlerRefresh = async () => {
		setRefresh(true);
		await fetch();
		setRefresh(false);
	};

	const handlePress = (name: string) => {
		setSelectedName(name);
		setModalVisible(true);
	};

	const filteredAsistencia =
		selectedGroup && selectedDate
			? {
					[selectedDate]:
						asistencia[selectedGroup]?.[selectedDate] || [],
			  }
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
					<View className="flex-row justify-between items-center">
						<Text className="text-base mr-3 font-semibold">
							Filtros:
						</Text>
						<Pressable
							className="top-0 right-1 m-2"
							onPress={() => setIsModalVisible(true)}
						>
							<Text className="text-sm text-gray-500">
								Eliminar Datos
							</Text>
						</Pressable>
					</View>
					<View className="items-center content-between justify-center">
						<View className="flex-row items-center  mb-2">
							<Text className="text-black text-lg mr-4">
								Grupo:
							</Text>
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
							<Text className="text-black  text-lg mr-4">
								Fecha:
							</Text>
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
					<View className="flex-row justify-between items-center">
						<Text className="text-base font-semibold">
							Alumnos:
						</Text>
						<Pressable
							className="top-0 right-1 m-2"
							onPress={() => saveData.saveAttendanceCVS()}
						>
							<Text className="text-sm text-gray-500">
								Save CVS
							</Text>
						</Pressable>
					</View>
					{asistencia &&
					Object.keys(filteredAsistencia).length > 0 ? (
						Object.entries(filteredAsistencia).map(
							([date, names]) => (
								<View key={date} style={styles.dateContainer}>
									{names.map((name, index) => (
										<Pressable
											key={index}
											onPress={() => handlePress(name)}
										>
											<Text className="text-lg m-2 ml-4">
												{name}
											</Text>
										</Pressable>
									))}
								</View>
							)
						)
					) : (
						<View style={styles.noDataContainer}>
							<Text style={styles.noDataText}>
								No hay datos para mostrar
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
			<Modal
				transparent
				animationType="fade"
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<ModalScreen
					setModal={setModalVisible}
					data={selectedName || ""}
					grupo={parseInt(selectedGroup) || 1}
				/>
			</Modal>
			<Modal
				animationType="fade"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setIsModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View className="absolute" style={styles.modalContent}>
						<Text style={styles.modalText}>
							¿Estás seguro de que deseas eliminar los datos?
						</Text>
						<View style={styles.modalButtons}>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => setIsModalVisible(false)}
							>
								<Text style={styles.textStyle}>Cancelar</Text>
							</Pressable>
							<Pressable
								style={[styles.button, styles.buttonDelete]}
								onPress={async () => {
									try {
										await AsyncStorage.clear();

										setIsModalVisible(false);
									} catch (error) {
										console.error(
											"Failed to clear AsyncStorage:",
											error
										);
									}
								}}
							>
								<Text style={styles.textStyle}>Eliminar</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: 300,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	buttonDelete: {
		backgroundColor: "#FF0000",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	noDataContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
	noDataText: {
		color: "gray",
		fontSize: 12,
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
