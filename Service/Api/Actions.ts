import { AxiosResponse } from "axios";
import HttpClient from "../HttpClient";
import { IActions } from "@/Types/Registro";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthSessionOpenOptions } from "expo-web-browser";
import { ToastAndroid } from "react-native";

class Actions implements IActions {
	set = new Set();

	registro(body: FormData): Promise<Object> {
		return new Promise((resolve, reject) => {
			HttpClient.post("register", body)
				.then((response: AxiosResponse<ResponseApi>) => {
					if(response.data.status === 'fail'){
						throw new Error('No se pudo detectar un rostro')
					}
					console.log(response.data);
					resolve(response.data);
				})
				.catch((e) => {
					ToastAndroid.show(e.message|| 'Surgio un Error',ToastAndroid.SHORT);
					reject(e);
				});
		});
	}
	getStatus() {
		return new Promise((resolve, reject) => {
			HttpClient.get("").then((response) => {
				console.log(response);
			});
		});
	}
	private async saveDetectedNames(detectedNamesMap: asistencias) {
		let prev = await AsyncStorage.getItem("Users");
		let combinedMap: { [date: string]: Set<string> } = {};
		if (prev) {
			const prevM: asistencias = JSON.parse(prev);
			combinedMap = Object.fromEntries(
				Object.entries(prevM).map(([date, namesArray]) => [
					date,
					new Set(namesArray),
				])
			);
		}

		Object.entries(detectedNamesMap).forEach(([date, namesArray]) => {
			if (!combinedMap[date]) {
				combinedMap[date] = new Set();
			}
			namesArray.forEach((name) => combinedMap[date].add(name));
		});

		const data: asistencias = Object.fromEntries(
			Object.entries(combinedMap).map(([date, nameSet]) => [
				date,
				Array.from(nameSet),
			])
		);

		await AsyncStorage.setItem("Users", JSON.stringify(data));
	}

	private detectedNamesMap: { [date: string]: Set<string> } = {};

	reconocimiento(imagen: FormData): Promise<Object> {
		return new Promise((resolve, reject) => {
			console.log('Post...')
			HttpClient.post("recognize", imagen)
				.then(async (response: AxiosResponse<ResponseApi>) => {
					if(response.data.status === 'fail'){
						throw new Error("No se pudo detectar un Rostro")
					}
					const detectedNames = response.data.matches || [];
					const currentDate = new Date().toISOString().split("T")[0];

					if (!this.detectedNamesMap[currentDate]) {
						this.detectedNamesMap[currentDate] = new Set();
					}
					detectedNames.forEach((name) =>
						this.detectedNamesMap[currentDate].add(name)
					);

					const detectedNamesMapToSave = Object.fromEntries(
						Object.entries(this.detectedNamesMap).map(
							([date, namesSet]) => [date, Array.from(namesSet)]
						)
					);

					this.saveDetectedNames(detectedNamesMapToSave);
					const data = await AsyncStorage.getItem("Users");
					console.log(JSON.parse(data as string));
					console.log("response api", response.data);
					resolve(response.data);
				})
				.catch((e) => {
					ToastAndroid.show(e.message|| 'Surgio un Error',ToastAndroid.SHORT);
					reject(e);
				});
		});
	}
}

export const Api = new Actions();
