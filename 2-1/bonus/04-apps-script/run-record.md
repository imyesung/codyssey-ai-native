# BONUS 04 실행 기록

- 실행 도구: Google Apps Script `epos04Submit8sOnce`
- 모델: Google Gemini Omni Flash (`gemini-omni-1.2-flash`)
- 입력: [프롬프트](prompt.txt), 8초, 720p, 16:9. 참고 스틸은 프롬프트 작성에 사용했다.
- 용도: Apps Script로 요청한 결과를 보여 주는 별도 테이크.

| 단계 | 기록 |
|---|---|
| 제출 | 2026-11-26 00:59:16.427 KST. `POST /api/v1/videos`, `HTTP 202 processing`. 작업 번호 `vjob_3…8343`. |
| 처리 중 | 2026-11-26 00:59:56.312 KST. 같은 작업의 상태 조회 결과 `HTTP 200`, `processing`. |
| 완료 | 2026-11-26 01:01:01.995 KST. 같은 작업의 상태 조회 결과 `HTTP 200`, `completed`. |
| 다운로드 | 완료 작업에서 [원본 MP4](EPOS_BONUS-04_OMNI_8S.mp4)를 내려받았다. |
| 실제 차감 | 네이토 사용량에서 해당 세션 요청 1회, 192,000토큰 차감을 확인했다. |
| 파일 검증 | 영상 8.000초, 1280×720, 24 fps, 192 frames. H.264 영상과 AAC 스테레오 음성을 끝까지 디코딩했다. |
| SHA-256 | `93f7a663859340f4e56270142e886b8cf9339dc184016e1307067c58d4c7f581` |

[Apps Script 소스](EPOS_Bonus04_8s.gs)
