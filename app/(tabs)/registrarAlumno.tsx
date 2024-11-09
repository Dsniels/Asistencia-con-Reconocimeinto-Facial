import React, { useEffect, useState } from "react";
import {
	Modal,
	StyleSheet,
	TextInput,
	Button,
	Image,
	View,
	ToastAndroid,
	SafeAreaView,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Alumno } from "@/Types/Registro";
import { formatData } from "@/Service/FormatData";
import { Text } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { imageActions } from "@/Service/PhotosActions";
export default function RegistroAlumno() {
	const [alumno, setAlumno] = useState<Alumno>({
		nombre: "",
		matricula: 0,
		primerApellido: "",
		segundoApellido: "",
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

	const takePicture = async () => {
		try {
			if (cameraRef) {
				await imageActions.takePhoto(cameraRef, setAlumno, orientation);
			} else {
				throw new Error("No se Pudo Tomar la foto");
			}
			setIsCameraOpen(false);
		} catch (e: any) {
			console.log(e)
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
			<Text>Registro de alumnos</Text>
			<View>
				<Text>Nombre</Text>
				<TextInput
					style={{ color: "black" }}
					value={alumno.nombre}
					onChangeText={(text) =>
						setAlumno((prev) => ({ ...prev, nombre: text }))
					}
				/>
				<Text>Apellido Paterno</Text>
				<TextInput
					style={{ color: "black" }}
					value={alumno.primerApellido}
					onChangeText={(text) =>
						setAlumno((prev) => ({ ...prev, primerApellido: text }))
					}
				/>
				<Text>Apellido Materno</Text>
				<TextInput
					style={{ color: "black" }}
					value={alumno.segundoApellido}
					onChangeText={(text) =>
						setAlumno((prev) => ({
							...prev,
							segundoApellido: text,
						}))
					}
				/>
				<Text>Matricula</Text>
				<TextInput
					inputMode="numeric"
					style={{ color: "black" }}
					value={alumno.matricula.toString()}
					onChangeText={(text) =>
						setAlumno((prev) => ({
							...prev,
							matricula: Number(text),
						}))
					}
				/>
				<Text>Grupo</Text>
				<TextInput
					inputMode="numeric"
					style={{ color: "black" }}
					onChangeText={(text) =>
						setAlumno((prev) => ({
							...prev,
							grupo: Number(text),
						}))
					}
				/>
				<Button title="Tomar Foto" onPress={openCamera} />
				{alumno.imagen && (
					<View>
						<Button
							title="Eliminar foto"
							onPress={() =>
								setAlumno((prev) => ({ ...prev, imagen: null }))
							}
						/>
						<Ionicons name="remove" size={10} />
						<Image
							source={{ uri: alumno.imagen.uri }}
							style={styles.image}
						/>
					</View>
				)}
			</View>

			<Modal
				visible={isCameraOpen}
				animationType="slide"
				transparent={false}
			>
				<CameraView
					mute={true}
					style={styles.camera}
					ref={(ref) => setCameraRef(ref)}
				>
					<View style={styles.cameraButtonContainer}>
						<Button title="Tomar" onPress={takePicture} />
						<Button
							title="Cerrar"
							onPress={() => setIsCameraOpen(false)}
						/>
					</View>
				</CameraView>
			</Modal>

			<Button
				disabled={!alumno.imagen}
				title="Registrar"
				onPress={submit}
			/>
		</SafeAreaView>
		
	);
}

const styles = StyleSheet.create({
	container: {
		margin:20,
		flex: 1,
		padding: 20,
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
	},
	image: {
		width: 100,
		height: 100,
		marginTop: 20,
	},
});
