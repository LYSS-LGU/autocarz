# api/fetch_its_data.py

import os
import requests
from dotenv import load_dotenv
from config import ITS_SERVICES

# .env 파일 로드
load_dotenv(dotenv_path="api/itsapi.env")
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise EnvironmentError("❌ API_KEY가 .env 파일에서 로드되지 않았습니다. 파일 및 변수명을 확인하세요.")

def fetch_data(service_name: str):
    if service_name not in ITS_SERVICES:
        raise ValueError(f"❌ '{service_name}'는 유효한 서비스 이름이 아닙니다.")

    service = ITS_SERVICES[service_name]
    full_url = f"{service['url']}&apiKey={API_KEY}"

    print(f"📡 요청 URL: {full_url}")  # 디버깅용
    response = requests.get(full_url)

    print(f"📥 응답 코드: {response.status_code}")
    print(f"📃 응답 내용 일부: {response.text[:300]}...")  # 앞 300자만 출력

    try:
        return response.json()
    except Exception as e:
        raise ValueError(f"❌ JSON 파싱 실패: 응답이 JSON 형식이 아닙니다.\n에러: {e}\n본문 미리보기: {response.text[:300]}")

# 사용 예시
if __name__ == "__main__":
    service = "traffic"  # 예: 'event', 'cctv', ...
    print(f"\n[{ITS_SERVICES[service]['desc']}] 요청 중...")
    
    try:
        data = fetch_data(service)
        print("✅ 데이터 수신 완료")
        print(data)
    except Exception as err:
        print(f"\n🔥 오류 발생: {err}")
