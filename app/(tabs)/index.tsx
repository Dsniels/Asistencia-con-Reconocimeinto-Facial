import {
	Button,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import {
	Camera,
	CameraView,
	useCameraPermissions,
} from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { snap } from "@/Service/PhotosActions";

export default function TabOneScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView | null>(null);
	const [isCameraVisible, setIsCameraVisible] = useState(false);

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
					ref={cameraRef}
					facing="back"
					style={styles.camera}
				>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.button}
							onPress={() => snap( cameraRef.current as CameraView)}
						>
							<Text style={styles.buttonText}>Reconocer</Text>
						</TouchableOpacity>
					</View>
				</CameraView>
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
		flex: 1,
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

