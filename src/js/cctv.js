// src/js/cctv.js

const leafletMap = L.map("cctv-map").setView([37.5665, 126.978], 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(leafletMap);

// ⭐ HTML 변경에 따라 선택자 변경 및 추가 ⭐
// const regionSelect = document.getElementById("region"); // 기존 regionSelect는 이제 사용하지 않습니다.
const routeSelect = document.getElementById("route-select"); // 노선 선택 드롭다운
const areaSelect = document.getElementById("area-select"); // 지역 선택 드롭다운 (초기 비활성화)
const typeSelect = document.getElementById("cctv-type");
const listEl = document.getElementById("cctv-list");
const previewEl = document.getElementById("cctv-preview");
const loadingEl = document.getElementById("loading");

let currentCCTVData = []; // API에서 가져온 모든 CCTV 데이터를 저장합니다.
let allCCTVMarkers = L.featureGroup().addTo(leafletMap); // 모든 CCTV 마커를 관리할 레이어 그룹
let currentClickMarker = null; // 클릭한 위치에 표시될 마커
let rangeCircles = L.featureGroup().addTo(leafletMap); // 3km/5km 반경 원들을 관리할 레이어 그룹

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

async function fetchCCTVByBounds(bounds, cctvType = 1) {
  const { _southWest, _northEast } = bounds;
  const url = `https://openapi.its.go.kr:9443/cctvInfo?apiKey=50c837f74bba49ee866c9cf4564afd52&type=국도&cctvType=${cctvType}&minX=${_southWest.lng}&maxX=${_northEast.lng}&minY=${_southWest.lat}&maxY=${_northEast.lat}&getType=xml`;

  try {
    const res = await fetch(url);
    const xmlText = await res.text();
    // console.log("🔍 API XML 응답:", xmlText); // 콘솔 간소화를 위해 주석 처리

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const errorCode = xmlDoc.querySelector("errorCode")?.textContent;
    const errorMessage = xmlDoc.querySelector("errorMessage")?.textContent;

    if (errorCode && errorCode !== "000") {
      console.error(
        `🚨 CCTV API 에러 코드: ${errorCode}, 메시지: ${errorMessage}`
      );
      alert(
        `CCTV 데이터를 불러오는 중 오류 발생: ${errorMessage} (코드: ${errorCode})`
      );
      return [];
    }

    const dataElements = xmlDoc.querySelectorAll("data");
    const cctvData = [];

    dataElements.forEach((dataEl) => {
      const cctvurl = dataEl.querySelector("cctvurl")?.textContent;
      const cctvname = dataEl.querySelector("cctvname")?.textContent;
      let coordy = dataEl.querySelector("coordy")?.textContent;
      let coordx = dataEl.querySelector("coordx")?.textContent;

      if (coordx) {
        coordx = coordx.replace(";", "");
      }

      if (cctvurl && cctvname && coordy && coordx) {
        cctvData.push({
          cctvurl,
          cctvname,
          coordy,
          coordx,
        });
      }
    });

    return cctvData;
  } catch (err) {
    console.error("🚨 CCTV API 파싱 또는 네트워크 오류:", err);
    alert(
      "CCTV 데이터를 불러오는 중 오류가 발생했습니다. 개발자 콘솔을 확인해주세요."
    );
    return [];
  }
}

function renderCCTV(itemsToRender) {
  listEl.innerHTML = ""; // 기존 목록 초기화
  allCCTVMarkers.clearLayers(); // 기존 CCTV 마커 모두 제거
  previewEl.innerHTML = ""; // 미리보기 이미지 초기화

  if (itemsToRender.length === 0) {
    listEl.innerHTML = "<p>❌ 표시할 CCTV 데이터가 없습니다.</p>";
    return;
  }

  itemsToRender.forEach((item) => {
    const { coordy, coordx, cctvurl, cctvname } = item;
    if (!coordy || !coordx || !cctvurl) return;

    const marker = L.marker([parseFloat(coordy), parseFloat(coordx)]);
    marker.addTo(allCCTVMarkers).bindPopup(`
          <strong>${cctvname || "CCTV"}</strong><br/>
          <img src='${cctvurl}' width='250' style='border-radius:8px;' />
        `);

    marker.on("click", (e) => {
      previewEl.innerHTML = `
        <h3>${cctvname || "CCTV"}</h3>
        <img src="${cctvurl}" width="500" style="border-radius:10px;" />
      `;
      L.DomEvent.stopPropagation(e);
    });

    const div = document.createElement("div");
    div.className = "cctv-item";
    div.innerHTML = `
          <p><strong>${cctvname || "이름 없음"}</strong></p>
          <img src="${cctvurl}" alt="CCTV" width="320"/>
        `;
    div.addEventListener("click", () => {
      previewEl.innerHTML = `
        <h3>${cctvname || "CCTV"}</h3>
        <img src="${cctvurl}" width="500" style="border-radius:10px;" />
      `;
      leafletMap.flyTo([parseFloat(coordy), parseFloat(coordx)], 15);
    });
    listEl.appendChild(div);
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  loadingEl.style.display = "block";

  const defaultType = typeSelect.value;
  const allCCTV = await fetchCCTVByBounds(leafletMap.getBounds(), defaultType);
  currentCCTVData = allCCTV;

  if (allCCTV.length === 0) {
    listEl.innerHTML =
      "<p>❌ 초기 로드: CCTV 데이터를 불러오지 못했습니다. API 응답을 확인해주세요.</p>";
    loadingEl.style.display = "none";
    return;
  }

  listEl.innerHTML =
    "<p>지도에 원하는 위치를 클릭하여 주변 CCTV를 확인하세요!</p>";

  // ⭐ 노선(route)과 지역(area) 데이터를 분리하여 저장할 객체 ⭐
  const routesAndAreas = {};

  allCCTV.forEach((d) => {
    const name = d.cctvname || "";
    let route = "";
    let area = "";

    const routeMatch = name.match(/\[(.*?)\]/);
    if (routeMatch && routeMatch[1]) {
      route = routeMatch[1].trim();
    }

    const areaPart = name.split("]").pop();
    if (areaPart) {
      area = areaPart.replace(/;|CCTV|\[|\]/g, "").trim();
    }

    if (route && area) {
      if (!routesAndAreas[route]) {
        routesAndAreas[route] = new Set(); // 중복 방지를 위해 Set 사용
      }
      routesAndAreas[route].add(area);
    }
  });

  // ⭐ 노선(route) 드롭다운 채우기 ⭐
  routeSelect.innerHTML = '<option value="">노선을 선택하세요</option>';
  const sortedRoutes = Object.keys(routesAndAreas).sort();
  sortedRoutes.forEach((route) => {
    const option = document.createElement("option");
    option.value = route;
    option.textContent = route;
    routeSelect.appendChild(option);
  });

  loadingEl.style.display = "none";

  // ⭐ 노선(route) 선택 시 지역(area) 드롭다운 업데이트 ⭐
  routeSelect.addEventListener("change", () => {
    const selectedRoute = routeSelect.value;
    areaSelect.innerHTML = '<option value="">지역을 선택하세요</option>';
    areaSelect.disabled = true; // 기본적으로 비활성화

    if (selectedRoute) {
      const areas = Array.from(routesAndAreas[selectedRoute]).sort(); // Set을 배열로 변환 후 정렬
      areas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
      });
      areaSelect.disabled = false; // 노선 선택 시 활성화
    }
    // 노선 또는 지역 선택이 변경되면 필터링된 CCTV를 다시 보여줍니다.
    updateFilteredCCTV();
  });

  // ⭐ 지역(area) 선택 시 필터링 업데이트 ⭐
  areaSelect.addEventListener("change", updateFilteredCCTV);
  typeSelect.addEventListener("change", updateFilteredCCTV);

  leafletMap.on("click", function (e) {
    const { lat, lng } = e.latlng;

    if (currentClickMarker) {
      leafletMap.removeLayer(currentClickMarker);
    }
    rangeCircles.clearLayers();
    allCCTVMarkers.clearLayers();

    currentClickMarker = L.marker([lat, lng])
      .addTo(leafletMap)
      .bindPopup(
        `📍 클릭한 위치<br/>위도: ${lat.toFixed(5)}, 경도: ${lng.toFixed(5)}`
      )
      .openPopup();

    L.circle([lat, lng], {
      radius: 3000,
      color: "orange",
      fillColor: "#FFA500",
      fillOpacity: 0.2,
    })
      .addTo(rangeCircles)
      .bindTooltip("3km 반경");

    L.circle([lat, lng], {
      radius: 5000,
      color: "blue",
      fillColor: "#87CEFA",
      fillOpacity: 0.1,
    })
      .addTo(rangeCircles)
      .bindTooltip("5km 반경");

    const nearbyCCTVs = currentCCTVData.filter((item) => {
      const cctvLat = parseFloat(item.coordy);
      const cctvLng = parseFloat(item.coordx);
      if (isNaN(cctvLat) || isNaN(cctvLng)) return false;
      const distance = getDistance(lat, lng, cctvLat, cctvLng);
      return distance <= 5;
    });

    console.log(
      `📡 클릭한 위치로부터 반경 5km 이내 CCTV: ${nearbyCCTVs.length}개`
    );

    renderCCTV(nearbyCCTVs);

    if (nearbyCCTVs.length > 0) {
      L.popup()
        .setLatLng([lat, lng])
        .setContent(
          `✔️ 클릭 위치 주변 ${nearbyCCTVs.length}개의 CCTV가 있어요!`
        )
        .openOn(leafletMap);
    } else {
      L.popup()
        .setLatLng([lat, lng])
        .setContent(`❌ 클릭 위치 주변 5km 이내에 CCTV가 없어요.`)
        .openOn(leafletMap);
    }
  });

  window.moveToSeongnam = () => {
    leafletMap.setView([37.42889, 127.12361], 14);
    allCCTVMarkers.clearLayers();
    if (currentClickMarker) {
      leafletMap.removeLayer(currentClickMarker);
      currentClickMarker = null;
    }
    rangeCircles.clearLayers();
    listEl.innerHTML = "<p>지도를 클릭하여 주변 CCTV를 확인하세요!</p>";
  };

  async function updateFilteredCCTV() {
    loadingEl.style.display = "block";

    const selectedRoute = routeSelect.value; // 선택된 노선 값
    const selectedArea = areaSelect.value; // 선택된 지역 값
    const selectedType = typeSelect.value;

    // API 호출은 현재 맵 바운드와 선택된 CCTV 유형 기준으로 계속 유지합니다.
    // 이렇게 해야 사용자가 맵을 이동하거나 CCTV 유형을 바꿀 때마다 최신 데이터를 가져올 수 있습니다.
    const fetchedCCTV = await fetchCCTVByBounds(
      leafletMap.getBounds(),
      selectedType
    );
    currentCCTVData = fetchedCCTV;

    let filteredItems = currentCCTVData;

    // ⭐ 노선(route) 필터 적용 ⭐
    if (selectedRoute) {
      filteredItems = filteredItems.filter((d) => {
        const name = d.cctvname || "";
        const routeMatch = name.match(/\[(.*?)\]/);
        const route = routeMatch && routeMatch[1] ? routeMatch[1].trim() : "";
        return route === selectedRoute;
      });
    }

    // ⭐ 지역(area) 필터 적용 ⭐
    if (selectedArea) {
      filteredItems = filteredItems.filter((d) => {
        const name = d.cctvname || "";
        const areaPart = name.split("]").pop();
        const area = areaPart
          ? areaPart.replace(/;|CCTV|\[|\]/g, "").trim()
          : "";
        return area === selectedArea;
      });
    }

    // 기존 클릭 마커 및 반경 원 제거
    if (currentClickMarker) {
      leafletMap.removeLayer(currentClickMarker);
      currentClickMarker = null;
    }
    rangeCircles.clearLayers();

    // 필터링된 CCTV를 렌더링
    renderCCTV(filteredItems);

    // 필터링 결과에 따라 지도 뷰 조정
    if (filteredItems.length > 0) {
      const bounds = L.latLngBounds(
        filteredItems.map((item) => [
          parseFloat(item.coordy),
          parseFloat(item.coordx),
        ])
      );
      leafletMap.fitBounds(bounds.pad(0.1));
    } else {
      // 필터링 결과가 없으면 지도를 초기 뷰로 리셋
      leafletMap.setView([37.5665, 126.978], 11);
      listEl.innerHTML = "<p>필터링 결과, CCTV 데이터가 없습니다.</p>";
    }

    loadingEl.style.display = "none";
  }

  // ⭐ 기존 regionSelect 이벤트 리스너는 제거하고, routeSelect와 areaSelect에 각각 연결합니다. ⭐
  // regionSelect.addEventListener("change", updateFilteredCCTV); // 이 줄은 제거합니다.
});
