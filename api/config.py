# api/config.py

ITS_SERVICES = {
    "traffic": {
        "desc": "교통소통정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=traffic"
    },
    "event": {
        "desc": "돌발상황정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=event"
    },
    "cctv": {
        "desc": "CCTV 화상자료",
        "url": "https://www.its.go.kr/opendata/opendataList?service=cctv"
    },
    "fcTraffic": {
        "desc": "교통예측정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=fcTraffic"
    },
    "detectorInfo": {
        "desc": "차량검지정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=detectorInfo"
    },
    "vms": {
        "desc": "도로전광표지(VMS) 정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=vms"
    },
    "safeDriving": {
        "desc": "주의운전구간 정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=safeDriving"
    },
    "vsl": {
        "desc": "가변형 속도제한표지정보(VSL)",
        "url": "https://www.its.go.kr/opendata/opendataList?service=vsl"
    },
    "weakSection": {
        "desc": "취약구간정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=weakSection"
    },
    "nodelink": {
        "desc": "표준노드링크",
        "url": "https://www.its.go.kr/opendata/opendataList?service=nodelink"
    },
    "dangerousCarInfo": {
        "desc": "위험물질 운송차량 사고정보",
        "url": "https://www.its.go.kr/opendata/opendataList?service=dangerousCarInfo"
    }
}
