// src/js/vms.js (이 파일은 vms.html과 같은 폴더에 있다고 가정합니다.)

// HTML 요소들을 JavaScript 변수로 가져옵니다.
// 이렇게 하면 코드에서 이 요소들을 쉽게 다룰 수 있어요.
const apiKeyInput = document.getElementById("apiKey");
const roadTypeSelect = document.getElementById("roadType");
const routeNoInput = document.getElementById("routeNo");
const directionTypeSelect = document.getElementById("directionType");
const responseFormatSelect = document.getElementById("responseFormat");
const fetchVMSButton = document.getElementById("fetchVMSButton");
const loadingEl = document.getElementById("loading"); // 로딩 메시지 요소
const rawResponseEl = document.getElementById("rawResponse"); // 원시 응답 표시 요소
const parsedVMSListEl = document.getElementById("parsedVMSList"); // 파싱된 목록 표시 요소

// VMS API의 기본 URL입니다.
const VMS_API_BASE_URL = "https://openapi.its.go.kr:9443/vmsInfo";

// 데이터를 불러오는 비동기 함수를 정의합니다.
// async/await를 사용하여 비동기 작업을 더 깔끔하게 처리할 수 있어요.
async function fetchVMSData() {
  // API 호출 전에 이전 결과와 로딩 메시지를 초기화합니다.
  rawResponseEl.textContent = "";
  parsedVMSListEl.innerHTML = "";
  loadingEl.style.display = "block"; // 로딩 메시지 표시

  // HTML 입력 필드에서 현재 선택된/입력된 값들을 가져옵니다.
  const apiKey = apiKeyInput.value.trim();
  const roadType = roadTypeSelect.value;
  const routeNo = routeNoInput.value.trim();
  const directionType = directionTypeSelect.value;
  const responseFormat = responseFormatSelect.value;

  // 필수 입력값이 비어있는지 확인합니다.
  if (!apiKey || !routeNo) {
    alert("API 키와 노선 번호는 필수 입력값입니다. 😉");
    loadingEl.style.display = "none";
    return; // 함수 실행을 여기서 중단합니다.
  }

  // API 요청 URL을 동적으로 생성합니다.
  // URLSearchParams를 사용하면 쿼리 파라미터를 쉽게 만들 수 있어요.
  const queryParams = new URLSearchParams({
    apiKey: apiKey,
    type: roadType,
    routeNo: routeNo,
    drcType: directionType,
    getType: responseFormat, // 'getType'은 응답 형식을 지정하는 파라미터입니다.
    // minX, maxX, minY, maxY 등 선택적 좌표 파라미터도 추가할 수 있지만,
    // 현재는 노선/방향으로 조회하는 것이 더 일반적이므로 생략했습니다.
  });

  const apiUrl = `${VMS_API_BASE_URL}?${queryParams.toString()}`;

  try {
    // fetch 함수를 사용하여 API를 호출합니다.
    // 네트워크 요청을 보내는 부분이에요.
    const response = await fetch(apiUrl);

    // HTTP 응답 상태 코드(예: 200 OK, 404 Not Found)가 성공적이지 않은 경우 에러 처리
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    // 응답 형식에 따라 데이터를 파싱합니다 (XML 또는 JSON).
    let data;
    let rawText; // 원시 응답을 저장할 변수

    if (responseFormat === "xml") {
      rawText = await response.text(); // XML 응답을 텍스트로 먼저 읽어옵니다.
      const parser = new DOMParser();
      data = parser.parseFromString(rawText, "application/xml"); // 텍스트를 XML 문서 객체로 파싱합니다.

      // XML 에러 코드 확인 (ITS API는 errorCode 태그를 사용하는 경우가 많습니다)
      const errorCodeEl = data.querySelector("errorCode");
      if (errorCodeEl && errorCodeEl.textContent !== "000") {
        const errorMessageEl = data.querySelector("errorMessage");
        throw new Error(
          `API 에러: ${errorCodeEl.textContent} - ${
            errorMessageEl ? errorMessageEl.textContent : "알 수 없는 오류"
          }`
        );
      }
    } else {
      // JSON 형식인 경우
      rawText = await response.text(); // JSON 응답을 텍스트로 먼저 읽어옵니다.
      data = JSON.parse(rawText); // 텍스트를 JSON 객체로 파싱합니다.

      // JSON 응답에서 에러 코드 확인 (JSON 응답 구조는 API마다 다를 수 있으니 확인 필요)
      // ITS API는 JSON 응답도 XML과 유사한 에러 구조를 가질 수 있습니다.
      if (data.errorCode && data.errorCode !== "000") {
        throw new Error(
          `API 에러: ${data.errorCode} - ${
            data.errorMessage || "알 수 없는 오류"
          }`
        );
      }
    }

    // 원시 응답을 웹 페이지에 표시합니다.
    rawResponseEl.textContent = rawText;

    // 파싱된 데이터를 웹 페이지에 목록으로 표시합니다.
    renderVMSData(data, responseFormat);
  } catch (error) {
    // API 호출 또는 데이터 처리 중 오류가 발생하면 콘솔에 에러를 기록하고 사용자에게 알립니다.
    console.error("🚨 VMS 데이터를 불러오는 중 오류 발생:", error);
    alert(
      `VMS 데이터를 불러오는 데 실패했습니다. 콘솔을 확인해주세요! \n오류: ${error.message}`
    );
    rawResponseEl.textContent = `오류 발생: ${error.message}`; // 오류 메시지 표시
  } finally {
    // API 호출이 성공했든 실패했든, 로딩 메시지를 숨깁니다.
    loadingEl.style.display = "none";
  }
}

// 파싱된 VMS 데이터를 HTML 목록으로 렌더링하는 함수입니다.
function renderVMSData(data, format) {
  parsedVMSListEl.innerHTML = ""; // 기존 목록을 초기화합니다.

  let vmsItems = [];

  if (format === "xml") {
    // XML 응답에서 'data' 태그들을 찾습니다.
    const dataElements = data.querySelectorAll("data");
    if (dataElements.length === 0) {
      parsedVMSListEl.innerHTML = "<li>VMS 데이터가 없습니다.</li>";
      return;
    }
    dataElements.forEach((dataEl) => {
      // 각 VMS 정보 태그에서 필요한 값을 추출합니다.
      const vmsId = dataEl.querySelector("vmsId")?.textContent;
      const vmsName = dataEl.querySelector("vmsName")?.textContent;
      const vmsMessage = dataEl.querySelector("vmsMessage")?.textContent;
      const xCoord = dataEl.querySelector("xCoord")?.textContent;
      const yCoord = dataEl.querySelector("yCoord")?.textContent;
      const vmsType = dataEl.querySelector("vmsType")?.textContent; // VMS 유형 (예: 101:정보형)

      vmsItems.push({ vmsId, vmsName, vmsMessage, xCoord, yCoord, vmsType });
    });
  } else {
    // JSON 형식
    // JSON 응답 구조에 따라 데이터를 추출합니다.
    // ITS API의 JSON 응답은 'data' 배열 안에 항목들이 있을 것으로 예상합니다.
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      vmsItems = data.data.map((item) => ({
        vmsId: item.vmsId,
        vmsName: item.vmsName,
        vmsMessage: item.vmsMessage,
        xCoord: item.xCoord,
        yCoord: item.yCoord,
        vmsType: item.vmsType,
      }));
    } else {
      parsedVMSListEl.innerHTML =
        "<li>VMS 데이터가 없거나 JSON 응답 구조가 예상과 다릅니다.</li>";
      return;
    }
  }

  // 추출된 VMS 항목들을 HTML 목록(ul)에 추가합니다.
  vmsItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <strong>ID:</strong> ${item.vmsId || "N/A"}<br>
            <strong>이름:</strong> ${item.vmsName || "N/A"}<br>
            <strong>메시지:</strong> ${item.vmsMessage || "N/A"}<br>
            <strong>유형:</strong> ${item.vmsType || "N/A"}<br>
            <strong>좌표:</strong> Lat ${item.yCoord || "N/A"}, Lng ${
      item.xCoord || "N/A"
    }
        `;
    parsedVMSListEl.appendChild(listItem);
  });
}

// 버튼 클릭 이벤트 리스너를 추가합니다.
// 버튼이 클릭되면 fetchVMSData 함수가 실행됩니다.
fetchVMSButton.addEventListener("click", fetchVMSData);

// 페이지 로드 시 기본적인 API 키 입력 가이드 메시지를 설정합니다.
document.addEventListener("DOMContentLoaded", () => {
  if (apiKeyInput.value === "발급받은 API 키를 여기에 입력하세요") {
    alert(
      "🚨 중요: VMS 정보를 조회하려면 'API Key' 필드에 발급받은 실제 API 키를 입력해야 합니다."
    );
  }
});
