export const parseMDBFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const mdbFileResponse = await fetch("http://127.0.0.1:3001/parse-mdb", {
      method: "POST",
      body: formData,
    });
    console.log(mdbFileResponse);
    if (mdbFileResponse.ok) {
      console.log("ok!");
    }
  } catch (error) {
    console.log("error");
  }
};
