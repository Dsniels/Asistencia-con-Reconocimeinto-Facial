import { AxiosResponse } from "axios";
import HttpClient from "./HttpClient";
import { IActions } from "@/Types/Registro";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import { StorageService, saveData } from "../StorageService";
import * as Haptics from "expo-haptics";

export class ApiService implements IActions {
	private detectedNamesMap: {
		[group: string]: { [date: string]: Set<string> };
	} = {};

	private Store: StorageService;

	constructor(saveData: StorageService) {
		this.Store = saveData;
	}

	registro(body: FormData): Promise<void> {
		return new Promise((resolve, reject) => {
			HttpClient.post("register", body)
				.then((response: AxiosResponse<ResponseApi>) => {
					if (response.data.status === "fail") {
						throw new Error("No se pudo detectar un rostro");
					}
					ToastAndroid.showWithGravity(
						"Alumno Registrado",
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					);
					resolve();
				})
				.catch((e) => {
					ToastAndroid.show(
						e.message || "Surgio un Error",
						ToastAndroid.SHORT
					);
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Error
					);
					reject(e);
				});
		});
	}
	getStatus() {
		return new Promise((resolve, reject) => {
			HttpClient.get("").then((response) => {
				resolve(response);
			});
		});
	}

	reconocimiento(imagen: FormData): Promise<void> {
		return new Promise((resolve, reject) => {
			HttpClient.post("recognize", imagen)
				.then(async (response: AxiosResponse<ResponseApi>) => {
					if (response.data.status === "fail") {
						throw new Error(response.data.message);
					}
					const detectedNames = response.data.matches || [];
					const currentDate = new Date().toISOString().split("T")[0];

					detectedNames.forEach((match: string) => {
						const [group, ...rest] = match.split(" ");
						const name = rest.slice(0, -1).join(" ").trim();
						const id = rest[rest.length - 1];

						if (!this.detectedNamesMap[group]) {
							this.detectedNamesMap[group] = {};
						}
						if (!this.detectedNamesMap[group][currentDate]) {
							this.detectedNamesMap[group][currentDate] =
								new Set();
						}
						this.detectedNamesMap[group][currentDate].add(
							`${id} ${name}`
						);
					});

					const detectedNamesMapToSave = Object.fromEntries(
						Object.entries(this.detectedNamesMap).map(
							([group, datesMap]) => [
								group,
								Object.fromEntries(
									Object.entries(datesMap).map(
										([date, namesSet]) => [
											date,
											Array.from(namesSet),
										]
									)
								),
							]
						)
					);

					await this.Store.saveDetectedNames(detectedNamesMapToSave);
					await AsyncStorage.getItem("Users2");
					ToastAndroid.showWithGravity(
						"Asistencia Registrada",
						ToastAndroid.LONG,
						ToastAndroid.CENTER
					);
					// Haptics.notificationAsync(
					// 	Haptics.NotificationFeedbackType.Success
					// );
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
					resolve();
				})
				.catch((e) => {
					ToastAndroid.show(
						e.message || "Surgio un Error",
						ToastAndroid.SHORT
					);
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Error
					);
					resolve();
				});
		});
	}

	deleteUser(body: FormData): Promise<void> {
		return new Promise((resolve, reject) => {
			HttpClient.post("/delete_user", body)
				.then((response) => {
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					);
					ToastAndroid.show("Usuario Eliminado", ToastAndroid.LONG);
				})

				.catch((e) => {
					ToastAndroid.show(
						e.message || "Error al Eliminar",
						ToastAndroid.SHORT
					);
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Error
					);

					reject(e);
				});
		});
	}

	editarUsuario(body: FormData): Promise<void> {
		return new Promise((resolve, reject) => {
			HttpClient.put("/edit", body)
				.then((response: AxiosResponse) => {
					ToastAndroid.show("Usuario Editado", ToastAndroid.SHORT);
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					);
					resolve();
				})
				.catch((e) => {
					ToastAndroid.show(
						e.message || "Surgio un Error",
						ToastAndroid.SHORT
					);
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Error
					);

					reject(e);
				});
		});
	}
}

export const Api = new ApiService(saveData);
