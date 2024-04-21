document.addEventListener("DOMContentLoaded", async function () {
  const video = document.getElementById("video");

  // set up canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  // get camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing the camera", err);
    });

  document.body.addEventListener("click", async () => {
    // set the canvas size same as video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // display the video on canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // convert the screen shot to base64 URL
    canvas.toBlob(async (blob) => {
      console.log(blob);
      let formData = new FormData();
      formData.append("my-file", blob, "filename.jpeg");
      // send the image to the server
      await fetch("/api/image", {
        method: "POST",
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);
        const resultImage = document.getElementById("resultImage");
        resultImage.src = data.result;
      })
      .catch((err) => {
        console.error("Failed to send image", err);
      });
    }, "image/jpeg");
  });
});