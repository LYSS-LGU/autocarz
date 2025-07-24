# 🚗 AutocarZ - 통합 교통 안전 플랫폼 (종합 가이드)

### 실시간 교통정보 대시보드 + AI 객체 탐지 시스템

자율주행 환경에서 발생할 수 있는 로드킬 등 돌발상황을 신속하게 감지하고,  
주변 차량 및 관제 시스템에 해당 정보를 공유하여 2차 사고를 예방하는 것을 목표로 하는  
**실시간 교통 정보 대시보드** + **AI 객체 탐지 시스템** 통합 프로젝트입니다.

> **이 문서는 AutocarZ 프로젝트를 쉽게 이해하고, 기록/학습/운영에 활용할 수 있도록 기존의 상세 가이드에 프로젝트 개요 정보를 통합한 종합 설명서입니다.**

---

## ✨ 주요 기능 (Key Features)

### 📍 실시간 교통정보 대시보드

- **ITS 공공데이터 연동**: CCTV, VMS(도로전광판), 돌발상황 정보를 지도에 실시간 표시
- **인터랙티브 지도**: Leaflet.js 기반, 클릭 위치 중심 주변 교통정보 동적 필터링
- **상황별 시각화**: VMS 전광판 시뮬레이션, 교통사고 특별 아이콘 표시
- **자율주행 제보**: 블랙박스 제보 모드로 이상 객체 발견 시뮬레이션

### 🤖 AI 객체 탐지 시스템

- **고라니 전용 YOLO 모델**: AIHUB 데이터셋 기반 고라니 특화 인식
- **이중 검출 시스템**: YOLO + OpenCV 동시 검출로 안정성 확보
- **플랫폼 최적화**: 라즈베리파이(성능) vs PC(고품질) 자동 최적화
- **실시간 웹 스트리밍**: Flask 기반 실시간 영상 및 탐지 결과 제공
- **검출 결과 유지**: 검출된 객체 박스 3-5초간 화면에 유지

---

## 🛠️ 기술 스택

### Frontend

- **HTML5, CSS3, JavaScript (ES6 Modules)**
- **Leaflet.js**: 인터랙티브 지도
- **WebRTC**: 실시간 카메라 스트리밍

### Backend

- **Python, Flask**: 웹서버 및 API
- **YOLOv8**: AI 객체 탐지 (고라니 전용)
- **OpenCV**: 컴퓨터 비전 및 보조 탐지
- **Requests**: ITS 공공 API 연동

### AI/ML

- **PyTorch, Ultralytics**: 딥러닝 프레임워크
- **NumPy, OpenCV**: 이미지 처리
- **Custom YOLO Model**: 고라니 특화 모델

---

## 📂 프로젝트 구조

```plaintext
autocarz/
├── autocar_project/              # 🎯 메인 프로젝트 폴더
│   ├── backend/                  # 백엔드 서버
│   │   ├── main.py              # 🚀 통합 서버 실행 진입점 (포트 5000)
│   │   ├── routes/              # Flask 라우트 (Blueprint 방식)
│   │   │   ├── main_routes.py   # 메인 페이지, 비디오 스트리밍
│   │   │   ├── camera_routes.py # 카메라 제어 API
│   │   │   ├── settings_routes.py # 설정 관리
│   │   │   ├── status_routes.py   # 시스템 상태
│   │   │   └── its_routes.py      # 교통정보 API 프록시
│   │   ├── vision/              # AI 객체 탐지 모듈
│   │   │   ├── camera/
│   │   │   │   └── camera_manager.py # 카메라 제어 및 AI 통합
│   │   │   ├── detection/
│   │   │   │   ├── yolo_detector.py  # YOLO 객체 탐지
│   │   │   │   └── opencv_detector.py # OpenCV 보조 탐지
│   │   │   └── models/          # AI 모델 파일
│   │   │       ├── best.pt      # 고라니 YOLO 모델
│   │   │       ├── data.yaml    # 클래스 정보
│   │   │       └── haarcascades/ # OpenCV 모델
│   │   ├── api/                 # API 설정
│   │   │   ├── config.py
│   │   │   └── itsapi.env       # ITS API 키 (git 제외)
│   │   └── utils/               # 유틸리티
│   │       └── settings_manager.py
│   ├── frontend/                # 프론트엔드
│   │   ├── pages/
│   │   │   ├── traffic.html     # 교통정보 대시보드 UI
│   │   │   └── yolo_opencv.html # AI 탐지 시스템 UI
│   │   ├── css/                 # 스타일시트
│   │   │   ├── traffic.css, cctv.css, vms.css
│   │   │   └── style.css        # AI 시스템 스타일
│   │   └── js/                  # JavaScript 모듈
│   │       ├── traffic/         # 교통정보 관련
│   │       │   ├── traffic_map.js # 메인 지도 컨트롤러
│   │       │   ├── cctv.js, vms.js, incident.js
│   │       │   └── reporting.js  # 제보 시뮬레이션
│   │       └── script/
│   │           └── script.js     # AI 시스템 제어
│   ├── data/                    # 데이터 및 이미지
│   │   ├── images/              # 프로젝트 이미지
│   │   └── 한국도로공사_공공데이터/ # 교통 데이터
│   └── docs/                    # 문서 및 참고자료
├── requirements.txt             # Python 패키지 목록
└── README.md                   # 프로젝트 설명서
```

---

## 🚀 시작하기 (Quick Start)

### 1️⃣ 환경 요구사항

- **Python 3.8+**
- **하드웨어**: 라즈베리파이 4 (4GB RAM 이상) 또는 Windows/Linux PC
- **카메라**: 라즈베리파이 카메라 모듈 또는 USB 웹캠

### 2️⃣ 설치 및 실행 (일반 PC)

```bash
# 1. 프로젝트 클론
git clone https://github.com/LYSS-LGU/autocarz.git
cd autocarz

# 2. 가상환경 설정
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 3. 패키지 설치
pip install -r requirements.txt

# 4. 환경 변수 설정 (ITS API 키)
# autocar_project/backend/api/itsapi.env 파일 생성
echo "ITS_API_KEY=여기에_발급받은_API_키_입력" > autocar_project/backend/api/itsapi.env

# 5. 통합 서버 실행
cd autocar_project/backend
python main.py
```

### 3️⃣ 설치 및 실행 (라즈베리파이)

```bash
# 1. 프로젝트 클론 및 브랜치 변경
git clone https://github.com/jiyoung1634/AutocarZ.git
cd AutocarZ
git checkout raspberrypi

# 2. 가상환경 설정
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip

# 3. 필수 시스템 라이브러리 설치
sudo apt update
sudo apt install -y build-essential python3-dev libjpeg-dev

# 4. Python 패키지 설치
pip install -r requirements.txt

# 4. AI 모델 파일 준비
mkdir -p models  # models 폴더가 없다면 생성
# [중요] best.pt 파일을 models/ 폴더에 넣어주세요. (별도 다운로드 또는 SCP로 전송)

# [중요] 고라니 전용 YOLO 모델 준비
# 방법 1: AIHUB 데이터셋으로 훈련된 모델 사용
# models/best.pt (고라니 전용 모델)
# models/data.yaml (클래스 정보: ['고라니'])

# 방법 2: 기존 COCO 모델 사용 (다른 동물도 인식 가능)
# wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt -O models/best.pt

# 5. YOLO 클래스 정보 파일 확인
# models/data.yaml 파일이 있는지 확인
cat models/data.yaml
# 예상 출력: names: ['고라니']

# 6. OpenCV 얼굴 탐지 모델 추가
mkdir -p models/haarcascades
# OpenCV 내장 cascade 파일 사용(pip) 또는 수동 다운로드

# 7. (PiCamera 사용 시) 카메라 활성화
sudo raspi-config
# Interface Options > Camera > Enable 선택 후 재부팅

# 6. AI 모델 파일 준비
# models/ 폴더에 best.pt, data.yaml 파일을 넣어주세요.

# 7. 시스템 실행
cd autocar_project/backend  # 또는 src
python3 main.py
```

### 4️⃣ 웹 접속

- **교통정보 대시보드**: http://localhost:5000/pages/traffic.html
- **AI 탐지 시스템**: http://localhost:5000/ 또는 http://localhost:5000/pages/yolo_opencv.html
- **API 상태**: http://localhost:5000/status

---

## 🎯 시스템 구성

### 교통정보 대시보드 흐름

1. **사용자** → 웹 대시보드에서 지도 클릭
2. **프론트엔드** → 클릭 위치 좌표를 백엔드로 전송
3. **백엔드** → ITS 공공 API 호출 (CCTV, VMS, 돌발상황)
4. **지도** → 반경 내 교통정보를 마커로 표시
5. **VMS 시뮬레이션** → 실제 전광판처럼 메시지 표출

### AI 탐지 시스템 흐름

1. **카메라** → 실시간 영상 캡처 (라즈베리파이/USB 웹캠)
2. **YOLO + OpenCV** → 이중 객체 탐지 (고라니 등)
3. **Flask** → 웹 스트리밍으로 탐지 결과 실시간 전송
4. **웹 UI** → 브라우저에서 탐지된 객체 확인
5. **제보 시스템** → 이상 객체 발견 시 위치 정보와 함께 서버 전송

---

## 📊 주요 API 엔드포인트

### 교통정보 API

- `GET /api/cctv`: CCTV 정보 조회
- `GET /api/vms`: VMS 전광판 정보 조회
- `GET /api/its_event`: 돌발상황 정보 조회

### AI 탐지 API

- `GET /video_feed`: 실시간 영상 스트림
- `GET /status`: 시스템 상태 조회
- `POST /switch_camera`: 카메라 전환

---

## 🔄 모델 교체 및 고급 설정

### YOLO 모델 교체

```bash
# 1. 새로운 모델 파일을 아래 경로에 복사
cp your_new_model.pt autocar_project/backend/vision/models/best.pt
cp your_data.yaml autocar_project/backend/vision/models/data.yaml

# 2. 모델 정보 확인 (선택 사항)
python -c "from ultralytics import YOLO; model = YOLO('autocar_project/backend/vision/models/best.pt'); print('클래스:', model.names)"

# 3. 서버 재시작
```

### 플랫폼별 최적화 설정

- **라즈베리파이**: 640x480, 15fps, 3프레임마다 탐지 (자동 최적화)
- **PC/노트북**: 1280x720, 30fps, 매 프레임 탐지 (자동 최적화)

---

## 🛠️ 문제 해결 (Troubleshooting)

### 카메라 인식 안 될 때

```bash
# Linux/Raspberry Pi: 카메라 장치 확인
ls /dev/video*

# 권한 확인
sudo usermod -a -G video $USER
```

### 패키지 설치 오류

```bash
# 시스템 의존성 설치 (Debian/Ubuntu 기반)
sudo apt update
sudo apt install -y build-essential python3-dev libjpeg-dev

# OpenCV 재설치
pip uninstall opencv-python
pip install opencv-python>=4.8.0
```

### YOLO 클래스 이름 문제 (`Class_0` 등으로 표시될 때)

```bash
# 원인: models/data.yaml 파일이 없거나 내용이 잘못됨
# 해결: 훈련 시 사용한 data.yaml 파일을 models/ 폴더에 복사
cat autocar_project/backend/vision/models/data.yaml
# 출력 예시: names: ['고라니']
```

### OpenCV `cv2.data` 속성 오류

````python
# 일부 OpenCV 설치 환경에서 cv2 모듈에 'data' 속성이 없을 때 발생
# 해결: hasattr로 속성 존재 여부 확인 후 경로 설정
if hasattr(cv2, 'data') and hasattr(cv2.data, 'haarcascades'):
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
else:
    # 대체 경로 지정
    cascade_path = 'autocar_project/backend/vision/models/haarcascades/haarcascade_frontalface_default.xml'
# 해결 방법 3: pip로 OpenCV 재설치
pip uninstall opencv-python
pip install opencv-python==4.12.0.88```

---




---

## ❓ 자주 묻는 질문 (FAQ)

- **Q. 어떤 파일을 실행해야 하나요?**
  - A. `autocar_project/backend/main.py`만 실행하면 전체 서비스가 동작합니다.

- **Q. 웹캠으로도 되나요?**
  - A. 네, USB 웹캠도 지원합니다. 라즈베리파이와 노트북 모두에서 자동으로 최적화됩니다.

- **Q. 고라니가 다른 동물로 잘못 인식돼요!**
  - A. 고라니 전용 모델(`models/best.pt`)을 사용하고 있는지 확인하세요. COCO 모델은 고라니를 인식하지 못합니다.

- **Q. 모델을 바꾸고 싶어요!**
  - A. `autocar_project/backend/vision/models/` 폴더의 `best.pt`와 `data.yaml`만 교체하면 됩니다. 코드 수정은 필요 없습니다.

- **Q. 검출 결과가 너무 빨리 사라져요!**
  - A. 검출된 객체 박스는 3-5초간 유지됩니다. 더 오래 유지하려면 `camera_manager.py`의 `result_keep_time` 값을 조정하세요.

- **Q. 라즈베리파이에서 성능이 느려요!**
  - A. 자동으로 성능 최적화 모드(640x480, 15fps)로 설정됩니다. 더 빠르게 하려면 해상도를 낮추세요.

- **Q. CSS/JS가 적용 안 돼요!**
  - A. 반드시 Flask 서버(`http://localhost:5000`)를 통해 접속해야 합니다. HTML 파일을 직접 열면(Live Server 등) 동작하지 않습니다.

````
# autocarz-Supabase
