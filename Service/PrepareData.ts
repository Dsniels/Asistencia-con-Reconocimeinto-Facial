import { CameraView } from "expo-camera";
import { Kairos } from "./Api/Actions";
import { CameraCapturedPicture } from "expo-camera/build/legacy/Camera.types";

export const snap = async (condition: boolean, camera: CameraView) => {
	try {
		if (camera) {
			let photo = await camera.takePictureAsync({ base64: true });
			if (photo) {
				const data = prepareData(photo);

				condition
					? Kairos.reconocimiento(data)
					: Kairos.registro({
							userId: "Nuevo Usuario",
							imagen: data,
					  });
			}
		}
	} catch (e) {
		console.log("error on snap: ", e);
	}
};

const prepareData = (imagen: CameraCapturedPicture): FormData => {
	const data = new FormData();
	let filename = imagen.uri.split("/").pop();

	let match = /\.(\w+)$/.exec(filename as string);
	let type = match ? `image/${match[1]}` : `image`;
    //@ts-ignore
	data.append("file", { uri: imagen.uri, name: "file", type });

	return data;
};
