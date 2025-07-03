# autocarz

---

## ✅ 추천 구조: ITS 연동 전용 모듈 분리하기

autocarz/
├── src/
│ ├── pages/ ✅ UI: autocarz.html
│ │ ├── autocarz.html ← UI 렌더링 중심
│ │ └── cctv.html 👈 CCTV 전용 페이지
│ ├── styles/ ✅ CSS: autocarz.css, leaflet-style.css
│ │ ├── autocarz.css
│ │ └── leaflet-style.css
│ ├── js/ ✅ 로직 분리: camera.js, map.js, itsService.js
│ │ ├── camera.js ← 카메라 로직
│ │ ├── map.js ← 지도 초기화, 마커 관련
│ │ ├── itsService.js ← ✅ ITS API 호출 및 처리
│ │ └── cctv.js 👈 CCTV API 및 지역 선택 처리

---

---

## 🔐 환경변수 설정 (.env)

autocarz/
├── api/
│ ├── itsapi.env ✅ 환경 변수 (.env 형식)
│ ├── config.py ✅ 서비스 목록 (URL + 설명 포함)
│ ├── .env.example ✅ 공유용 템플릿
│ └── fetch_its_data.py ✅ 실제 API 호출 모듈

ITS API를 사용하기 위해선 API 키를 환경 변수로 설정해야 합니다.

1. `api/itsapi.env` 파일을 생성합니다.
2. 아래와 같은 형식으로 작성합니다:

```env
API_KEY=your_actual_api_key_here
실제 키는 ITS 공공데이터 포털에서 발급받습니다.
예시 형식은 api/.env.example을 참고하세요.
.env 파일은 .gitignore에 포함되어 있어 Git에 커밋되지 않습니다.
```

---
