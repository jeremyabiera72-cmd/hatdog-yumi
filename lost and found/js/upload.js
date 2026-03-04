export async function uploadImage(file) {
  const apiKey = "fa0a284c3740c0ae00d2c54c2b2de444";
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.data.url;
}