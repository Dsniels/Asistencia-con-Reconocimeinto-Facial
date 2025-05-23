import { Alumno, asistencias } from "@/Types/Registro";
import AsyncStorage from "expo-sqlite/kv-store";
import { StorageAccessFramework, writeAsStringAsync } from "expo-file-system";
import { ToastAndroid } from "react-native";

type CsvFile = {
  grupo: string;
  fecha: string;
  matricula: string;
  nombre: string;
};

export class StorageService {

  public async saveRecord(user: Alumno) {
    try {
      const prevData = await AsyncStorage.getItem("Users4");
      let existingData = prevData ? JSON.parse(prevData) : {};
      if (!user.grupo || !user.nombre) {
        return
      }

      if (!existingData[user?.grupo as number]) {
        existingData[user.grupo] = {
          count: 0,
          students: []
        };
      }
      existingData[user.grupo].students.push(user.matricula);
      existingData[user.grupo].count += 1;
      await AsyncStorage.setItem("Users4", JSON.stringify(existingData));
    } catch (error) {
      console.error("Error al guardar el registro:", error);
    }
  }
  public async getRegisteredStudentsByGroup(grupo: any) {
      const prevData = await AsyncStorage.getItem("Users4");
      const existingData = prevData ? JSON.parse(prevData) : {};

      return existingData[grupo] || { count: 0, students: [] };
  }

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
            const index = users.findIndex((user) => user.includes(name));
            if (index !== -1) {
              users[index] = `${id.trim()} ${modfName.trim()}`;
            }
          }
        }

        AsyncStorage.setItem("Users2", JSON.stringify(asistencias));
      }
    } catch (e: any) {
      ToastAndroid.show(e.message || "Error al editar", ToastAndroid.SHORT);
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
            const index = users.findIndex((user) => user.includes(name));

            if (index !== -1) {
              users.splice(index, 1);
            }
          }
        }

        await AsyncStorage.setItem("Users2", JSON.stringify(asistencias));
        //AsyncStorage.clear()
      }
    } catch (e: any) {
      ToastAndroid.show(e.message || "Error al eliminar", ToastAndroid.SHORT);
    }
  }

  public async saveDetectedNames(
    detectedNamesMap: Record<string, Record<string, string[]>>,
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
            new Set([...existingNames, ...newNames]),
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
      const fields = ["Grupo", "Fecha", "Matricula", "Alumno"];
      const newData: CsvFile[] = [];

      for (const [grupo, asistencia] of Object.entries(data)) {
        for (const [fecha, nombre] of Object.entries(asistencia)) {
          nombre.forEach((name) => {
            const [matricula, ...rest] = name.split(" ");
            newData.push({
              grupo: grupo,
              fecha: fecha,
              matricula: matricula,
              nombre: rest.join(" "),
            });
          });
        }
      }

      let csv = fields.join(",") + "\n";
      newData.forEach((row) => {
        csv += `${row.grupo},${row.fecha},${row.matricula},${row.nombre}\n`;
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          "Lista_Asistencias.csv",
          "text/csv",
        )
          .then(async (uri) => {
            writeAsStringAsync(uri, csv)
              .then(() =>
                ToastAndroid.show("Archivo guardado", ToastAndroid.CENTER),
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
        ToastAndroid.LONG,
      );
    }
  }
}
export const saveData = new StorageService();
