import { CameraCapturedPicture } from "expo-camera"
import { ImageResult } from "expo-image-manipulator";




export type Alumno = {
    nombre :string,
    primerApellido : string,
    segundoApellido : string,
    matricula : number 
    imagen : CameraCapturedPicture | null|  ImageResult
}

export interface IActions {
    registro( imagen: FormData) : Promise<Object>;
    reconocimiento(imagen:FormData):Promise<Object>;
}

