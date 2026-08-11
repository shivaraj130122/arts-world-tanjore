import api from "./api";

export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("Please select an image");
  }

  const formData = new FormData();

  formData.append("image", file);

  const { data } = await api.post(
    "/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};