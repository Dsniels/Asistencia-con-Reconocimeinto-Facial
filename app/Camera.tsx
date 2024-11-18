import { Camera, CameraView } from "expo-camera";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const CameraComponent = ({
	setCameraRef,
	children,
	isCameraVisible,
}: {
	isCameraVisible: boolean;
	children: JSX.Element;
	setCameraRef: Dispatch<SetStateAction<CameraView | null>>;
}) => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	if (!isCameraVisible) return null;

	useEffect(() => {
		const requestCameraPermissions = async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		};

		requestCameraPermissions();
	}, []);

	return (
		<CameraView active={true}  style={styles.camera} ref={(ref) => setCameraRef(ref)}>
			{children}
		</CameraView>
	);
};
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
		backgroundColor: "transparent",
	},
	image: {
		borderRadius: 100,
		width: 150,
		height: 150,
		marginTop: 20,
	},
});

export default CameraComponent;
