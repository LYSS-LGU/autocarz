// src/js/map.js

import { fetchEventData, fetchSafeDrivingData } from "./itsService.js";
import { initCamera, capturePhoto } from "./camera.js";

let leafletMap;

function setITSStatus(msg, isError = false) {
  const el = document.getElementById("its-status-message");
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? "red" : "black";
}

// 페이지 로드 후 지도 초기화 및 이벤트 연결
window.addEventListener("DOMContentLoaded", async () => {
  // 지도 초기화
  leafletMap = L.map("leafletmap").setView([37.5665, 126.978], 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(leafletMap);

  try {
    // ITS 마커 로딩
    const events = await fetchEventData();
    events.forEach(({ title, lat, lon }) => {
      L.marker([lat, lon]).addTo(leafletMap).bindPopup(`🚧 ${title}`);
    });

    const zones = await fetchSafeDrivingData();
    zones.forEach(({ message, lat, lon }) => {
      L.circle([lat, lon], {
        color: "blue",
        fillColor: "#0af",
        fillOpacity: 0.2,
        radius: 1000,
      })
        .addTo(leafletMap)
        .bindPopup(`⚠️ ${message}`);
    });

    setITSStatus(
      `✅ ITS API 불러오기 완료 (돌발: ${events.length}건, 주의: ${zones.length}건)`
    );
  } catch (err) {
    console.error(err);
    setITSStatus("🚨 ITS API 불러오기 실패", true);
  }

  // 버튼 이벤트 연결
  initCamera();
  document.getElementById("captureBtn").addEventListener("click", () => {
    capturePhoto(leafletMap);
  });
});
