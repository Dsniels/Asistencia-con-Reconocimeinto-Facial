import { asistencias } from "@/Types/Registro";
import AsyncStorage from "expo-sqlite/kv-store";
import {
	documentDirectory,
	EncodingType,
	makeDirectoryAsync,
	readAsStringAsync,
	StorageAccessFramework,
	writeAsStringAsync,
} from "expo-file-system";
import { Directory, File, Paths } from "expo-file-system/next";
import { ToastAndroid } from "react-native";

export class StorageService {
	public async editUser(currentName: string, newName: string) {
		try {
			const [g, ...rst] = currentName.split(" ");
			const mtrc = rst[rst.length - 1];
			const name = mtrc + " " + rst.slice(0, -1).join(" ");
			const [grp, ...rest] = newName.split(" ");
			const modfName = rest.slice(0, -1).join(" ");
			const id = rest[rest.length - 1];

			const data = await AsyncStorage.getItem("Users2");
			if (data) {
				const asistencias: asistencias = JSON.parse(data);

				for (const grupo in asistencias) {
					for (const date in asistencias[grupo]) {
						const users = asistencias[grupo][date];
						const index = users.findIndex((user) =>
							user.includes(name)
						);

						if (index !== -1) {
							users[index] = `${id.trim()} ${modfName.trim()}`;
						}
					}
				}

				AsyncStorage.setItem("Users2", JSON.stringify(asistencias));
				//AsyncStorage.clear()
			}
		} catch (e: any) {
			ToastAndroid.show(
				e.message || "Error al editar",
				ToastAndroid.SHORT
			);
		}
	}
	public async deleteUser(currentName: string) {
		try {
			const [g, ...rst] = currentName.split(" ");
			const mtrc = rst[rst.length - 1];
			const name = mtrc + " " + rst.slice(0, -1).join(" ");

			const data = await AsyncStorage.getItem("Users2");
			if (data) {
				const asistencias: asistencias = JSON.parse(data);

				for (const grupo in asistencias) {
					for (const date in asistencias[grupo]) {
						const users = asistencias[grupo][date];
						const index = users.findIndex((user) =>
							user.includes(name)
						);

						if (index !== -1) {
							users.splice(index, 1);
						}
					}
				}

				await AsyncStorage.setItem(
					"Users2",
					JSON.stringify(asistencias)
				);
				//AsyncStorage.clear()
			}
		} catch (e: any) {
			ToastAndroid.show(
				e.message || "Error al eliminar",
				ToastAndroid.SHORT
			);
		}
	}

	public async saveDetectedNames(
		detectedNamesMap: Record<string, Record<string, string[]>>
	) {
		try {
			const prevData = await AsyncStorage.getItem("Users2");
			let existingData = prevData ? JSON.parse(prevData) : {};

			for (const group in detectedNamesMap) {
				if (!existingData[group]) {
					existingData[group] = {};
				}
				for (const date in detectedNamesMap[group]) {
					if (!existingData[group][date]) {
						existingData[group][date] = [];
					}
					const newNames = detectedNamesMap[group][date];
					const existingNames = existingData[group][date];
					const combinedNames = Array.from(
						new Set([...existingNames, ...newNames])
					);
					existingData[group][date] = combinedNames;
				}
			}

			await AsyncStorage.setItem("Users2", JSON.stringify(existingData));
		} catch (error) {
			console.error("Error inesperado", error);
		}
	}

	public async saveAttendanceCVS() {
		try {
			const storeObj = await AsyncStorage.getItem("Users2");
			if (!storeObj) throw new Error("No hay datos para guardar");
			const data: asistencias = JSON.parse(storeObj);
			const fields = ["grupo", "date", "attendance"];
			const newData: any = [];

			for (const [grupo, asistencia] of Object.entries(data)) {
				for (const [fecha, nombre] of Object.entries(asistencia)) {
					nombre.forEach((name) => {
						newData.push({
							grupo: grupo,
							fecha: fecha,
							nombre: name,
						});
					});
				}
			}

			let csv = fields.join(",") + "\n";
			newData.forEach((row: any) => {
				csv += `${row.grupo},${row.fecha},${row.nombre}\n`;
			});

			const permissions =
				await StorageAccessFramework.requestDirectoryPermissionsAsync();

			if (permissions.granted) {
				await StorageAccessFramework.createFileAsync(
					permissions.directoryUri,
					"attendance.csv",
					"text/csv"
				)
					.then(async (uri) => {
						ToastAndroid.show(uri, ToastAndroid.LONG);
						writeAsStringAsync(uri, csv, {
							encoding: EncodingType.Base64,
						})
							.then(() =>
								ToastAndroid.show(
									"Archivo guardado",
									ToastAndroid.CENTER
								)
							)
							.catch((e) => {
								throw new Error(e);
							});
					})
					.catch((e) => console.log(e));
			} else {
				throw new Error("Permisos de almacenamiento denegado");
			}
		} catch (e: any) {
			ToastAndroid.show(
				e.message || "Error al guardar archivo",
				ToastAndroid.LONG
			);
		}
	}
}
export const saveData = new StorageService();
