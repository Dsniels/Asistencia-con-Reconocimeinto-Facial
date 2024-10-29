import { CameraCapturedPicture } from "expo-camera"




export type Alumno = {
    nombre :string,
    primerApellido : string,
    segundoApellido : string,
    matricula : number 
    imagen : CameraCapturedPicture | null
}

export interface IActions {
    registro( imagen: FormData) : Promise<Object>;
    reconocimiento(imagen:FormData):Promise<Object>;
}

