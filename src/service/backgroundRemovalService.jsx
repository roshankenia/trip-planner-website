import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY });

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // Remove the "data:image/...;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const base64ToFile = (base64Data, mimeType, fileName) => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
};

export const removeBackground = async (imageFile, categoryName) => {
  const base64 = await fileToBase64(imageFile);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      {
        text: `Remove the background, any people, and any other clothing articles or accessories from the ${categoryName} in this image. Keep only the ${categoryName} item itself in a forward view with a clean white background as if it was on a online shopping page. There should be nothing else but the ${categoryName} left with no people`
      },
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64
        }
      }
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  });

  // Extract the processed image from response
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const processedFile = base64ToFile(
        part.inlineData.data,
        part.inlineData.mimeType || "image/png",
        `processed_${imageFile.name}`
      );
      return processedFile;
    }
  }

  // If no image returned, fall back to original
  console.warn("Gemini did not return a processed image, using original");
  return imageFile;
};
