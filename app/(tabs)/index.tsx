import { Button, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/Themed";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Camera, CameraType } from "expo-camera/legacy";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { snap } from "@/Service/PhotosActions";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
	// const handleFacesDetected = ({ faces }) => {
	// 	if (faces.length > 0 && !photoTaken) {
	// 		snap(cameraRef.current as Camera);
	// 		      setPhotoTaken(true);

	// 	}
	// };

	return (
		<View style={styles.container}>
			{isCameraVisible && (
				<CameraView
				className="flex-1 justify-center align-middle content-center items-center"
					ref={cameraRef }
					facing={CameraType.back}
					style={styles.camera}
					
					// onFacesDetected={handleFacesDetected}
				>
					<View className="flex-1 justify-end items-center m-9 ">
						<TouchableOpacity className='flex bg-white content-center justify-center align-middle items-center  rounded-full h-20 w-20 text-white' onPress={()=>snap(cameraRef.current as CameraView)}>
							<MaterialCommunityIcons name="camera-iris" size={48}/>
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
