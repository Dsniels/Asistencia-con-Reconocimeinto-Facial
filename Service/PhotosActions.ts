import { CameraView } from "expo-camera";
import { Api } from "./Api/Actions";
import { CameraCapturedPicture } from "expo-camera/build/legacy/Camera.types";
import { Alumno } from "@/Types/Registro";
import { Camera } from "expo-camera/legacy";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const snap = async (camera: CameraView | Camera) => {
	try {
		if (camera) {
			let photo = await camera.takePictureAsync({ base64: true ,});
			if (photo) {
				// photo  = await rotateImage(photo);
				const data = prepareData(photo as CameraCapturedPicture);
				Api.reconocimiento(data);
			}
		}
	} catch (e) {
		console.log("error on snap: ", e);
	}
};

const rotateImage = async (image: CameraCapturedPicture) => {
	return await manipulateAsync(
		image.uri,
		[{ rotate: 90 }],
		{ compress: 1, format: SaveFormat.JPEG, base64: true }
	);
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

export const prepareRegister = (usuario : Alumno) =>{
	const value = Object.values(usuario)
	const valueFiltrados = value.filter(value => typeof value ==='string'  )
	const nombre = valueFiltrados.join(' ').toUpperCase() + usuario.matricula;
	let formData = prepareData(usuario.imagen as CameraCapturedPicture)
	formData.append('nombre',nombre);
	Api.registro(formData)

}