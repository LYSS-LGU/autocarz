// src/js/camera.js

let stream = null;

export function initCamera() {
  document.getElementById("toggleBtn").addEventListener("click", () => {
    const video = document.getElementById("camera");
    if (!stream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          video.srcObject = stream;
        })
        .catch(() => alert("카메라 접근이 차단되었습니다."));
    } else {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
      stream = null;
    }
  });
}

export function capturePhoto(leafletMap) {
  const video = document.getElementById("camera");
  const canvas = document.getElementById("snapshot");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const message = new SpeechSynthesisUtterance(
    "신고 접수가 완료 되었습니다. 오늘 하루도 고생하셨습니다."
  );
  message.lang = "ko-KR";
  window.speechSynthesis.speak(message);
  navigator.vibrate?.([300, 100, 300]);

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = parseFloat(pos.coords.latitude.toFixed(6));
    const lon = parseFloat(pos.coords.longitude.toFixed(6));
    const timestamp = new Date().toLocaleString();

    const entry = document.createElement("div");
    entry.className = "photo-log-entry";
    entry.innerText = `📸 [${timestamp}] 위도: ${lat}, 경도: ${lon}`;
    document.getElementById("photo-location-list").prepend(entry);

    const latlng = [lat, lon];

    L.marker(latlng)
      .addTo(leafletMap)
      .bindPopup("🦊 야생동물 발견 위치")
      .openPopup();

    L.circle(latlng, {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.3,
      radius: 3000,
    }).addTo(leafletMap);

    L.circle(latlng, {
      color: "orange",
      fillColor: "#fa0",
      fillOpacity: 0.15,
      radius: 5000,
    }).addTo(leafletMap);

    leafletMap.setView(latlng, 13);
  });
}
