import {
	Button,
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Text } from "@/components/Themed";
import { CameraView, useCameraPermissions } from "expo-camera";
import { CameraType } from "expo-camera/legacy";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { snap } from "@/Service/PhotosActions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
export default function TabOneScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView | null>(null);
	const [isCameraVisible, setIsCameraVisible] = useState(false);
	const [orientation, setOrientation] = useState(
		ScreenOrientation.Orientation.PORTRAIT_UP
	);
	const [image, setImage] = useState<{ imagen: { uri: string } | null }>({
		imagen: null,
	});
	useEffect(() => {
		const subscription = ScreenOrientation.addOrientationChangeListener(
			(event) => {
				setOrientation(event.orientationInfo.orientation);
			}
		);
		console.log(orientation);

		return () => {
			ScreenOrientation.removeOrientationChangeListener(subscription);
		};
	}, [orientation]);

	useFocusEffect(
		useCallback(() => {
			if (!permission) {
				requestPermission();
			} else if (permission.granted) {
				setIsCameraVisible(true);
			}

			return () => {
				setIsCameraVisible(false);
			};
		}, [permission])
	);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.permissionText}>
					We need your permission to show the camera
				</Text>

				<Button onPress={requestPermission} title="Grant Permission" />
			</View>
		);
	}
	return (
		<View style={styles.container}>
			{isCameraVisible && (
				<CameraView
					className="flex-1 justify-center align-middle content-center items-center"
					ref={cameraRef}
					facing={CameraType.back}
					style={styles.camera}

				>
					<View className="flex-1 justify-end items-center m-9 ">
						<TouchableOpacity
							className="flex bg-white content-center justify-center align-middle items-center  rounded-full h-20 w-20 text-white"
							onPress={() =>
								snap(
									cameraRef.current as CameraView,
									setImage,
									orientation
								)
							}
						>
							<MaterialCommunityIcons
								name="camera-iris"
								size={48}
							/>
						</TouchableOpacity>
					</View>
				</CameraView>
			)}
			{image.imagen && (
				<View>
					<Image
						source={{ uri: image?.imagen?.uri }}
						style={{ width: 100, height: 100 }}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	camera: {
		flex: 1,
		width: "100%",
		justifyContent: "flex-end",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 20,
	},
	button: {
		display: "flex",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		padding: 10,
		marginHorizontal: 10,
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 18,
		color: "white",
	},
	permissionText: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 20,
	},
});
