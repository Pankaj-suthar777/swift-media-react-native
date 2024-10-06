import firebaseApp from "./firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
export const uploadFilesToFirebaseAndGetUrl = async (
  file: any,
  folder: string
) => {
  try {
    const storage = getStorage(firebaseApp);
    const fileName = file.split("/").pop();
    const storageRef = ref(storage, `${folder}/${fileName}`);

    const response = await fetch(file); // Fetch the file from URI
    const blob = await response.blob(); // Convert to blob

    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL; // Return the download URL
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error(error.message); // Rethrow for further handling
  }
};
