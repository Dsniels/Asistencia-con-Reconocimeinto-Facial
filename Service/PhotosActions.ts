import { CameraView } from "expo-camera";
import { CameraCapturedPicture } from "expo-camera/build/legacy/Camera.types";
import { Camera } from "expo-camera/legacy";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { SetStateAction } from "react";
import { formatData, FormatData } from "./FormatData";
import { ToastAndroid } from "react-native";

class ImageActions {
	private prepareData: FormatData;

	constructor(formData: FormatData) {
		this.prepareData = formData;
	}

	private async _takePhoto(
		cam: CameraView | Camera,
		orientation: number
	): Promise<CameraCapturedPicture | null> {
		try {
			if (cam) {
				let photo = await cam.takePictureAsync({
					skipProcessing: true,
					base64: true,
				});
				if (photo && orientation === 4) {
					photo = await this.rotateImage(photo);
				}
				return photo as CameraCapturedPicture;
			}
		} catch (e: any) {
			console.error('ERROR EN METODO TAKE',e);
			ToastAndroid.show(
				e.message || "Surgio un Error",
				ToastAndroid.SHORT
			);
		}
		return null;
	}

	async takePhoto(
		cam: CameraView | Camera,
		action: SetStateAction<any>,
		orientation: number
	) {
		const photo = await this._takePhoto(cam, orientation);
		if (photo) {
			action((prev: any) => ({
				...prev,
				imagen: photo,
			}));
		}
	}

	async takePhotoAndSend(
		cam: CameraView | Camera,
		action: SetStateAction<any>,
		orientation: number
	) {
		const photo = await this._takePhoto(cam, orientation);
		if (photo) {
			action((prev: any) => ({
				...prev,
				imagen: photo,
			}));
			this.prepareData.sendImage(photo as CameraCapturedPicture);
		}
	}

	private async rotateImage(image: CameraCapturedPicture) {
		return await manipulateAsync(image.uri, [{ rotate: 270 }], {
			compress: 1,
			format: SaveFormat.JPEG,
			base64: true,
		});
	}
}

export const imageActions = new ImageActions(formatData);
