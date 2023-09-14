export const parseSoilFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const soilFileResponse = await fetch("http://127.0.0.1:3001/parse-mdb", {
      method: "POST",
      body: formData,
    });
    if (soilFileResponse.ok) {
      const jsonContent = await soilFileResponse.json();
      return jsonContent;
    }
  } catch (error) {
    console.log("error");
  }
};
