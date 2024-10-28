import { CameraCapturedPicture } from "expo-camera"


export type Registro = {
    userId : string
    imagen : FormData
}


export type Alumno = {
    nombre :string,
    primerApellido : string,
    segundoApellido : string,
    matricula : string
    imagen : CameraCapturedPicture | null
}

export interface IActions {
    registro({userId, imagen}:Registro) : Promise<Object>;
    reconocimiento(imagen:FormData):Promise<Object>;
}

