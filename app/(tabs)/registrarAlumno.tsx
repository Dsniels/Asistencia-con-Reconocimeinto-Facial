import React, { useEffect, useState } from "react";
import {
	Modal,
	StyleSheet,
	TextInput,
	Button,
	Image,
	View,
} from "react-native";
import { Camera, CameraCapturedPicture, CameraView } from "expo-camera";
import { Alumno } from "@/Types/Registro";
import { prepareRegister } from "@/Service/PhotosActions";
import { Text } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ScreenOrientation from "expo-screen-orientation";
export default function RegistroAlumno() {
	const [alumno, setAlumno] = useState<Alumno>({
		nombre: "",
		matricula: 0,
		primerApellido: "",
		segundoApellido: "",
		imagen: null,
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

	const rotateImage = async (
		image: CameraCapturedPicture
	): Promise<CameraCapturedPicture> => {
		await Image.getSize(image.uri, async (w, h) => {
			if (w > h) {
				return await manipulateAsync(image.uri, [{ rotate: 90 }], {
					compress: 1,
					format: SaveFormat.JPEG,
					base64: true,
				});
			}
		});

		return image;
	};

	const takePicture = async () => {
		if (cameraRef) {
			let photo = (await cameraRef.takePictureAsync({
				skipProcessing: true,
				exif: true,
			})) as CameraCapturedPicture;
			if (photo) {

				setAlumno((prev) => ({
					...prev,
					imagen: photo,
				}));
				setIsCameraOpen(false);
			}
		}
	};

	const submit = () => {
		prepareRegister(alumno);
		setAlumno({
			nombre: "",
			primerApellido: "",
			segundoApellido: "",
			matricula: 0,
			imagen: null,
		});
	};

	return (
		<View style={styles.container}>
			<Text>Registro de alumnos</Text>
			<View>
				<Text>Nombre</Text>
				<TextInput
					style={{ color: "white" }}
					value={alumno.nombre}
					onChangeText={(text) =>
						setAlumno((prev) => ({ ...prev, nombre: text }))
					}
				/>
				<Text>Apellido Paterno</Text>
				<TextInput
					style={{ color: "white" }}
					value={alumno.primerApellido}
					onChangeText={(text) =>
						setAlumno((prev) => ({ ...prev, primerApellido: text }))
					}
				/>
				<Text>Apellido Materno</Text>
				<TextInput
					style={{ color: "white" }}
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
					style={{ color: "white" }}
					value={alumno.matricula.toString()}
					onChangeText={(text) =>
						setAlumno((prev) => ({
							...prev,
							matricula: Number(text),
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
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
