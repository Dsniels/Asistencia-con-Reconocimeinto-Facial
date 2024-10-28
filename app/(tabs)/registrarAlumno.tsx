import React, { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";
import { Alumno } from "@/Types/Registro";
import { Camera, CameraView } from "expo-camera";
import {
  Button,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";

export default function RegistroAlumno() {
  const [alumno, setAlumno] = useState<Alumno>({
    nombre: "",
    matricula: "",
    primerApellido: "",
    segundoApellido: "",
    imagen: null,
  });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  useEffect(() => {
    const requestCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermissions();
  }, []);

  const openCamera = () => {
    if (hasPermission) {
      setIsCameraOpen(true);
    } else {
      alert("Se necesita permiso para acceder a la cámara.");
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      if (photo) {
        setAlumno((prev) => ({
          ...prev,
          imagen: photo,
        }));
        setIsCameraOpen(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Registro de alumnos</Text>
      <View>
        <Text>Nombre</Text>
        <TextInput
          value={alumno.nombre}
          onChangeText={(text) => setAlumno((prev) => ({ ...prev, nombre: text }))}
        />
        <Text>Apellido Paterno</Text>
        <TextInput
          value={alumno.primerApellido}
          onChangeText={(text) => setAlumno((prev) => ({ ...prev, primerApellido: text }))}
        />
        <Text>Apellido Materno</Text>
        <TextInput
          value={alumno.segundoApellido}
          onChangeText={(text) => setAlumno((prev) => ({ ...prev, segundoApellido: text }))}
        />
        <Text>Matricula</Text>
        <TextInput
          value={alumno.matricula}
          onChangeText={(text) => setAlumno((prev) => ({ ...prev, matricula: text }))}
        />
        <Button title="Tomar Foto" onPress={openCamera} />
        {alumno.imagen && (
			<View>
				<Button title="Eliminar foto" onPress={()=>setAlumno((prev)=>({...prev, imagen : null}))}/>
				<Image source={{ uri: alumno.imagen.uri }} style={styles.image} />
			</View>
        )}
      </View>
      {isCameraOpen && hasPermission && (
        <CameraView
          style={styles.camera}
          ref={(ref) => setCameraRef(ref)}
          onCameraReady={() => console.log("Camera is ready")}
        >
          <View style={styles.cameraButtonContainer}>
            <Button title="Tomar" onPress={takePicture} />
            <Button title="Cerrar" onPress={() => setIsCameraOpen(false)} />
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  camera: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  cameraButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
});
