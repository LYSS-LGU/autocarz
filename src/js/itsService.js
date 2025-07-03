// src/js/itsService.js

// XML 파싱 유틸
function parseXMLString(xmlString) {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, "text/xml");
}

// 돌발상황 데이터 불러오기
export async function fetchEventData() {
  const url = "https://www.its.go.kr/opendata/opendataList?service=event";
  const res = await fetch(url);
  const xml = await res.text();
  const doc = parseXMLString(xml);
  return [...doc.querySelectorAll("data")].map((node) => ({
    title: node.querySelector("eventTypeDesc")?.textContent,
    lat: parseFloat(node.querySelector("coordY")?.textContent),
    lon: parseFloat(node.querySelector("coordX")?.textContent),
  }));
}

// 주의운전구간 데이터 불러오기
export async function fetchSafeDrivingData() {
  const url = "https://www.its.go.kr/opendata/opendataList?service=safeDriving";
  const res = await fetch(url);
  const xml = await res.text();
  const doc = parseXMLString(xml);
  return [...doc.querySelectorAll("data")].map((node) => ({
    message: node.querySelector("message")?.textContent,
    lat: parseFloat(node.querySelector("coordY")?.textContent),
    lon: parseFloat(node.querySelector("coordX")?.textContent),
  }));
}
