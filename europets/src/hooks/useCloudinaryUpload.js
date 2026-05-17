import { useState } from "react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    if (!file) return null;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Chỉ chấp nhận file JPG, PNG hoặc WEBP");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ảnh phải nhỏ hơn 5MB");
      return null;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        console.log("CLOUD_NAME:", CLOUD_NAME, "PRESET:", UPLOAD_PRESET); // ← thêm vào đây

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
        );

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status === 200) {
            resolve(data.secure_url);
          } else {
            reject(new Error(data.error?.message || "Upload thất bại"));
          }
        };

        xhr.onerror = () => reject(new Error("Lỗi kết nối mạng"));
        xhr.send(formData);
      });

      return url;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, progress, error };
}