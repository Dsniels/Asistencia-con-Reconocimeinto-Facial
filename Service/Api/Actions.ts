import { AxiosResponse } from "axios";
import HttpClient from "../HttpClient";
import { IActions, Registro } from "@/Types/Registro";

class Actions implements IActions {
	registro({ userId, imagen }: Registro): Promise<Object> {
    const body = imagen
    body.append("nombre", userId); 

		return new Promise((resolve, reject) => {
			HttpClient.post("register", body)
				.then((response: AxiosResponse) => {
					console.log(response.data);
					resolve(response.data);
				})
				.catch((e) => {

					console.log(e);
					reject(e);
				});
		});
	}
	getStatus(){
		return new Promise((resolve, reject)=>{
			HttpClient.get('').then((response)=>{
				console.log(response)
			})
		})
	}
	reconocimiento(imagen: FormData): Promise<Object> {
		return new Promise((resolve, reject) => {
			HttpClient.post("recognize", imagen)
				.then((response: AxiosResponse) => {
					console.log(response.data);
					resolve(response.data);
				})
				.catch((e) => {
					console.log(e);
					reject(e);
				});
		});
	}
}

export const Kairos = new Actions();
