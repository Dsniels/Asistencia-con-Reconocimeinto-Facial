import { Alumno } from "@/Types/Registro";
import { CameraCapturedPicture } from "expo-camera";
import { Api, ApiService } from "./Api/ApiService";
import { ToastAndroid } from "react-native";

export class FormatData {
	private Api: ApiService;

	constructor(api: ApiService) {
		this.Api = api;
	}

	sendImage(imagen: CameraCapturedPicture): void {
		const data = this.prepareData(imagen);
		ToastAndroid.show("Procesando...", ToastAndroid.SHORT);
		Api.reconocimiento(data);
	}

	prepareRegister(usuario: Alumno) {
		const value = Object.values(usuario);
		const valueFiltrados = value.filter(
			(value) => typeof value === "string"
		);
		if (usuario.grupo && usuario.matricula) {
			const nombre = `${usuario.grupo} ${valueFiltrados
				.join(" ")
				.toUpperCase()} ${usuario.matricula}`;
			let formData = this.prepareData(
				usuario.imagen as CameraCapturedPicture
			);
			formData.append("nombre", nombre);
            ToastAndroid.showWithGravity("Registrando Alumno", ToastAndroid.LONG, ToastAndroid.CENTER)
			this.Api.registro(formData);
		} else {
			ToastAndroid.show(
				"Todos los campos son necesarios",
				ToastAndroid.LONG
			);
		}
	}

	private prepareData(imagen: CameraCapturedPicture): FormData {
		const data = new FormData();
		let filename = imagen.uri.split("/").pop();
		let match = /\.(\w+)$/.exec(filename as string);
		let type = match ? `image/${match[1]}` : `image`;
		//@ts-ignore
		data.append("file", { uri: imagen.uri, name: "file", type });
		return data;
	}
}

export const formatData = new FormatData(Api);
