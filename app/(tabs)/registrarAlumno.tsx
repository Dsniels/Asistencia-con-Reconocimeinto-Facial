import React, { useEffect, useState, useCallback } from "react";
import {
	Modal,
	StyleSheet,
	TextInput,
	Button,
	Image,
	
	ToastAndroid,
	SafeAreaView,
	Pressable,
	Text,
	ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alumno } from "@/Types/Registro";
import { formatData } from "@/Service/FormatData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { imageActions } from "@/Service/PhotoService";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View } from "@/components/Themed";
import { useFocusEffect } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import CameraComponent from "../Camera";

export default function RegistroAlumno() {
	const [alumno, setAlumno] = useState<Alumno>({
		nombre: "".trim(),
		matricula: undefined,
		primerApellido: "".trim(),
		segundoApellido: "".trim(),
		imagen: null,
		grupo: undefined,
	});
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
	const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

	useEffect(() => {
		const requestCameraPermissions = async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		};

		requestCameraPermissions();
	}, []);
 
	const openCamera = () => {
		if (hasPermission) {
			setIsCameraOpen(true);
		} else {
			alert("Se necesita permiso para acceder a la cámara.");
		}
	};

	const [orientation, setOrientation] = useState(
		ScreenOrientation.Orientation.PORTRAIT_UP
	);

	useEffect(() => {
		const subscription = ScreenOrientation.addOrientationChangeListener(
			(event) => {
				setOrientation(event.orientationInfo.orientation);
			}
		);

		return () => {
			ScreenOrientation.removeOrientationChangeListener(subscription);
		};
	}, [orientation]);

	useFocusEffect(
		useCallback(() => {
			return () => {
				setCameraRef(null);
			};
		}, [])
	);

	const takePicture = async () => {
		try {
			if (cameraRef) {
				await imageActions.takePhoto(cameraRef, setAlumno, orientation);
			} else {
				throw new Error("No se Pudo Tomar la foto");
			}
			setIsCameraOpen(false);
		} catch (e: any) {
			ToastAndroid.show(
				e.message || "Surgio un Error",
				ToastAndroid.SHORT
			);
		}
	};

	const submit = () => {
		

		formatData.prepareRegister(alumno);
		setAlumno({
			nombre: "",
			primerApellido: "",
			segundoApellido: "",
			matricula: 0,
			imagen: null,
			grupo: undefined,
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View className="flex m-3 mb-5 p-5 h-full shadow-sm   items-center  rounded-3xl  ">
					<Text className="m-3 text-2xl font-bold subpixel-antialiased">
						Registro de alumnos
					</Text>
					<Image
						source={
							alumno.imagen
								? {
										uri: alumno.imagen.uri,
								  }
								: require("../../assets/images/avatar.png")
						}
						style={styles.image}
					/>

					<View className="mb-5 min-w-96  ">
						<Text className="text-xs m-1">Nombre</Text>
						<TextInput
							className="border p-2 border-gray-500 rounded-md text-black"
							style={{ color: "black" }}
							value={alumno.nombre}
							onChangeText={(text) =>
								setAlumno((prev) => ({ ...prev, nombre: text }))
							}
						/>
					</View>
					<View className="mb-5 min-w-96  ">
						<Text className="text-xs m-1">Apellido Paterno</Text>
						<TextInput
							className="border p-2 border-gray-500 rounded-md text-black"
							style={{ color: "black" }}
							value={alumno.primerApellido}
							onChangeText={(text) =>
								setAlumno((prev) => ({
									...prev,
									primerApellido: text.trim(),
								}))
							}
						/>
					</View>
					<View className="mb-5 min-w-96 ">
						<Text className="text-xs m-1">Apellido Materno</Text>
						<TextInput
							className="border p-2 border-gray-500 rounded-md text-black"
							style={{ color: "black" }}
							value={alumno.segundoApellido}
							onChangeText={(text) =>
								setAlumno((prev) => ({
									...prev,
									segundoApellido: text.trim(),
								}))
							}
						/>
					</View>
					<View className="flex-row justify-stretch">
						<View className="m-2 w-20 ">
							<Text className="text-xs m-1">Matricula</Text>
							<TextInput
								className="border p-2 border-gray-500 rounded-md text-black"
								inputMode="numeric"
								style={{ color: "black" }}
								onChangeText={(text) =>
									setAlumno((prev) => ({
										...prev,
										matricula: Number(text.trim()),
									}))
								}
							/>
						</View>
						<View className="m-2 w-20">
							<Text className="text-xs m-1">Grupo</Text>
							<TextInput
								className="border p-2 border-gray-500 rounded-md text-black"
								inputMode="numeric"
								style={{ color: "black" }}
								onChangeText={(text) =>
									setAlumno((prev) => ({
										...prev,
										grupo: Number(text.trim()),
									}))
								}
							/>
						</View>
						{alumno.imagen ? (
							<Pressable
								className="flex justify-center items-center"
								onPress={() =>
									setAlumno((prev) => ({
										...prev,
										imagen: null,
									}))
								}
							>
								<Text className="text-sm m-1">
									Eliminar Foto
								</Text>

								<AntDesign
									name="delete"
									size={40}
									color="#164E63"
								/>
							</Pressable>
						) : (
							<Pressable
								className="flex justify-center items-center"
								onPress={openCamera}
							>
								<Text className="text-sm m-1">Tomar Foto</Text>
								<MaterialIcons
									name="add-a-photo"
									size={40}
									color="#164E63"
								/>
							</Pressable>
						)}
					</View>
					<Pressable
						className="flex h-14 w-full m-9  color-white bg-cyan-700 shadow-md shadow-cyan-600 justify-center items-center align-middle p-2 rounded-xl "
						disabled={
							!(
								alumno.imagen &&
								alumno.primerApellido &&
								alumno.matricula &&
								alumno.grupo
							)
						}
						onPress={submit}
					>
						<Text className=" text-white ">Registrar</Text>
					</Pressable>
				</View>

				<Modal
					visible={isCameraOpen}
					animationType="slide"
					transparent={false}
				>
					<CameraComponent
					isCameraVisible={isCameraOpen}
					setCameraRef={setCameraRef}
					>
						<View className="bg-transparent"  style={styles.cameraButtonContainer}>
							<Pressable className="bg-white rounded-full" onPress={takePicture}>
								<MaterialCommunityIcons
									name="camera-iris"
									size={60}
									color="#164E63"
								/>
							</Pressable>
							<Pressable className="bg-white rounded-full" onPress={() => setIsCameraOpen(false)}>
								<MaterialIcons
									name="cancel"
									size={60}
									color="#164E63"
								/>
							</Pressable>
						</View>
					</CameraComponent>
				</Modal>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		flex: 1,
		padding: 10,
	},
	camera: {
		flex: 1,
		width: "100%",
		justifyContent: "flex-end",
	},
	cameraButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 20,
		backgroundColor:'transparent'
	},
	image: {
		borderRadius: 100,
		width: 150,
		height: 150,
		marginTop: 20,
	},
});
