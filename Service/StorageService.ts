import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
    public async saveDetectedNames(detectedNamesMap: Record<string, Record<string, string[]>>) {
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
                    const combinedNames = Array.from(new Set([...existingNames, ...newNames]));
                    existingData[group][date] = combinedNames;
                }
            }

            await AsyncStorage.setItem("Users2", JSON.stringify(existingData));
        } catch (error) {
            console.error("Error inesperado", error);
        }
    }
}

export const saveData = new StorageService();