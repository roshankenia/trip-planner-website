import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { removeBackground } from "./backgroundRemovalService";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 800,
  useWebWorker: true
};

export const uploadClothingImage = async (userId, itemId, file, categoryName) => {
  // Step 1: Remove background using Gemini
  const processedFile = await removeBackground(file, categoryName);

  // Step 2: Compress the processed image
  const compressedFile = await imageCompression(processedFile, COMPRESSION_OPTIONS);

  // Step 3: Upload to Firebase Storage
  const extension = processedFile.name.split('.').pop() || 'png';
  const storagePath = `wardrobe/${userId}/${itemId}.${extension}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, compressedFile);
  const downloadUrl = await getDownloadURL(storageRef);

  return { downloadUrl, storagePath };
};

export const deleteClothingImage = async (storagePath) => {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
};
