import { CameraView } from "expo-camera";
import { Api } from "./Api/Actions";
import { CameraCapturedPicture } from "expo-camera/build/legacy/Camera.types";
import { Alumno } from "@/Types/Registro";

export const snap = async (camera: CameraView) => {
	try {
		if (camera) {
			let photo = await camera.takePictureAsync({ base64: true });
			if (photo) {
				const data = prepareData(photo);
				 Api.reconocimiento(data)
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

export const prepareRegister = (usuario : Alumno) =>{
	const value = Object.values(usuario)
	const valueFiltrados = value.filter(value => typeof value ==='string'  )
	const nombre = valueFiltrados.join(' ').toUpperCase() + usuario.matricula;
	let formData = prepareData(usuario.imagen as CameraCapturedPicture)
	formData.append('nombre',nombre);
	Api.registro(formData)

}