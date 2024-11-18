import { Alumno } from "@/Types/Registro";
import { CameraCapturedPicture } from "expo-camera";
import { Api, ApiService } from "./Api/ApiService";
import { ToastAndroid } from "react-native";
import { saveData, StorageService } from "./StorageService";

export class FormatData {
	private Api: ApiService;
	private Store: StorageService;

	constructor(api: ApiService, store: StorageService) {
		this.Api = api;
		this.Store = store;
	}

	sendImage(imagen: CameraCapturedPicture): void {
		const data = this.prepareData(imagen);
		ToastAndroid.show("Procesando...", ToastAndroid.SHORT);
		Api.reconocimiento(data);
	}
	joinData(usuario: Alumno) {
		const value = Object.values(usuario);
		const valueFiltrados = value.filter(
			(value) => typeof value === "string"
		);
		const cleanedValues = valueFiltrados.map((v) => v.trim());
		const nombre = `${usuario.grupo} ${cleanedValues
			.join(" ")
			.toUpperCase()} ${usuario.matricula}`;
		return nombre;
	}

	prepareRegister(usuario: Alumno) {
		if (usuario.grupo && usuario.matricula) {
			const nombre = this.joinData(usuario);
			let formData = this.prepareData(
				usuario.imagen as CameraCapturedPicture
			);
			formData.append("nombre", nombre);
			ToastAndroid.showWithGravity(
				"Registrando Alumno",
				ToastAndroid.LONG,
				ToastAndroid.CENTER
			);
			this.Api.registro(formData);
		} else {
			ToastAndroid.show(
				"Todos los campos son necesarios",
				ToastAndroid.LONG
			);
		}
	}

	editar(currentName: string, newName: string) {
		queueMicrotask(() => {
			this.Store.editUser(currentName, newName);
		});

		let body = new FormData();
		body.append("currentName", currentName);
		body.append("newName", newName);
		this.Api.editarUsuario(body);
	}

	async prepareForDelete(name: string, deleteDefinitely = false) {
		let body = new FormData();
		body.append("nombre", name);
		queueMicrotask(() => {
			this.Store.deleteUser(name);
		});

		if (deleteDefinitely) {
			await this.Api.deleteUser(body);
		}
	}

	private prepareData(imagen: CameraCapturedPicture): FormData {
		const data = new FormData();
		let filename = imagen.uri.split("/").pop();
		let match = /\.(\w+)$/.exec(filename as string);
		let type = match ? `image/${match[1]}` : `image`;
		data.append("file", { uri: imagen.uri, name: "file", type });
		return data;
	}
}

export const formatData = new FormatData(Api, saveData);
