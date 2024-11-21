import {
	Pressable,
	StyleSheet,
	TextInput,
	ToastAndroid,
	Text,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
} from "react-native";

import { View } from "@/components/Themed";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alumno } from "@/Types/Registro";
import { formatData } from "@/Service/FormatData";
import {
	AntDesign,
	EvilIcons,
	MaterialIcons,
} from "@expo/vector-icons";

export default function ModalScreen({
	data,
	grupo,
	setModal,
}: {
	setModal: Dispatch<SetStateAction<boolean>>;
	data: string;
	grupo: number;
}) {
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [userName, setUserName] = useState<string>("");
	const [curName, setCurName] = useState<string>("");
	const [alumno, setAlumno] = useState<Alumno>({
		nombre: "",
		matricula: undefined,
		primerApellido: "",
		segundoApellido: "",
		imagen: null,
		grupo: undefined,
	});

	useEffect(() => {
		const name = formatData.joinData(alumno);
		setUserName(name);
	}, [alumno]);

	useEffect(() => {
		const [id, ...name] = data.split(" ");
		const formatName = `${grupo.toString().trim()} ${name
			.join(" ")
			.trim()} ${id}`;
		setAlumno((prev) => ({
			...prev,
			matricula: parseInt(id),
			grupo: grupo,
		}));
		setCurName(formatName);
	}, []);

	const handlerSubmit = () => {
		if (
			!alumno.nombre.trim() ||
			!alumno.primerApellido ||
			!alumno.segundoApellido
		) {
			ToastAndroid.showWithGravity(
				"Todos los campos son necesarios",
				ToastAndroid.SHORT,
				ToastAndroid.CENTER
			);
			return;
		}

		formatData.editar(curName, userName);
		setModal(false);
		return;
	};

	return (
		<KeyboardAvoidingView
			behavior="position"
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<>
				<View style={styles.modalContainer}>
					<View className="flex-1 bg-opacity-50  bg-slate-400 h-4/6 m-6 w-max p-5  rounded-2xl shadow-lg shadow-slate-300 justify-center items-center">
						<Pressable
							onPress={() => setModal(false)}
							className="absolute top-0 right-3 m-5"
						>
							<MaterialIcons
								name="cancel"
								size={24}
								color="black"
							/>
						</Pressable>
						<Text style={styles.title}>Editar </Text>
						<Text>{data}</Text>
						<View
							style={styles.separator}
							lightColor="#eee"
							darkColor="rgba(255,255,255,0.1)"
						/>
						<View className="mb-5 min-w-96  ">
							<Text className="text-xs m-1">Nombre</Text>
							<TextInput
								className="border p-2 border-gray-500 rounded-md text-black"
								style={{ color: "black" }}
								onChangeText={(text) =>
									setAlumno((prev) => ({
										...prev,
										nombre: text,
									}))
								}
							/>
						</View>
						<View className="mb-5 min-w-96  ">
							<Text className="text-xs m-1">
								Apellido Paterno
							</Text>
							<TextInput
								className="border p-2 border-gray-500 rounded-md text-black"
								style={{ color: "black" }}
								onChangeText={(text) =>
									setAlumno((prev) => ({
										...prev,
										primerApellido: text,
									}))
								}
							/>
						</View>
						<View className="mb-5 min-w-96 ">
							<Text className="text-xs m-1">
								Apellido Materno
							</Text>
							<TextInput
								className="border p-2 border-gray-500 rounded-md text-black"
								style={{ color: "black" }}
								onChangeText={(text) =>
									setAlumno((prev) => ({
										...prev,
										segundoApellido: text,
									}))
								}
							/>
						</View>
						<View className="flex-row justify-stretch">
							<View className="m-2 w-auto ">
								<Text className="text-xs m-1">Matricula</Text>
								<TextInput
									className="border p-2 border-gray-500 rounded-md text-black"
									inputMode="numeric"
									value={alumno.matricula?.toString()}
									style={{ color: "black" }}
									onChangeText={(text) =>
										setAlumno((prev) => ({
											...prev,
											matricula: Number(text),
										}))
									}
								/>
							</View>
						</View>
						<View className="flex-row mt-4 items-center justify-stretch content-center">
							<Pressable
								onPress={() => handlerSubmit()}
								className="flex-row p-2 rounded-xl shadow color-white m-3 items-center justify-center bg-[#2196F3]"
								style={{ flex: 1 }}
							>
								<AntDesign
									name="edit"
									size={20}
									color="white"
								/>
								<Text className="text-white text-sm ml-2">
									Editar
								</Text>
							</Pressable>
						</View>
						<View className="flex-row items-center justify-stretch content-center">
							<Pressable
								onPress={() => {
									setIsModalVisible(true);
								}}
								className="flex-row rounded-xl shadow p-2 m-3 color-white items-center justify-center bg-red-600"
								style={{ flex: 1 }}
							>
								<EvilIcons
									name="trash"
									size={26}
									color="white"
								/>
								<Text className="text-white text-sm ml-2">
									Eliminar Alumno
								</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									formatData.prepareForDelete(curName);
									setModal(false);
								}}
								className="flex-row rounded-xl shadow p-2 m-3 color-white items-center justify-center bg-red-600"
								style={{ flex: 1 }}
							>
								
								<Text className="text-white text-sm ml-2">
									Descartar Asistencia
								</Text>
							</Pressable>
						</View>
					</View>
				</View><Modal
				animationType="fade"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setIsModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View className="absolute" style={styles.modalContent}>
						<Text style={styles.modalText}>
							¿Estás seguro de que deseas eliminar el registro de este alumno?
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

									formatData.prepareForDelete(curName, true);

										setModal(false)
										setIsModalVisible(false);
									} catch (error) {
										ToastAndroid.show("Surgio un error al eliminar", ToastAndroid.SHORT);
									}
								}}
							>
								<Text style={styles.textStyle}>Eliminar</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
			</>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
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
		marginVertical: 25,
		height: 1,
		width: "80%",
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
