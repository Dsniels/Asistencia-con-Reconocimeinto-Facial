import { CameraCapturedPicture } from "expo-camera";
import { ImageResult } from "expo-image-manipulator";

export type asistencias = {
    [group: string]: {
        [date: string]: string[];
    };
};

export type Alumno = {
    nombre :string,
    primerApellido : string,
    segundoApellido : string,
    matricula : number| undefined,
    grupo : number | undefined,
    imagen : CameraCapturedPicture | null|  ImageResult
}

export interface IActions {
    registro( imagen: FormData) : Promise<void>;
    reconocimiento(imagen:FormData):Promise<void>;
    editarUsuario(data :FormData):Promise<void>;
    deleteUser(nombre:FormData):Promise<void>;
}

