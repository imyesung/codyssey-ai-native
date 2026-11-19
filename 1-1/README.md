# 1-1

문서 4개는 아래 순서로 읽으면 됩니다.

1. [LLM 모델 비교와 선정 보고서](./docs/model-comparison.md): 같은 지시문과 과제 원문을 웹 모델 3종에 보내고, 기준 4개로 채점해 Claude Opus 5.5를 골랐습니다.
2. [시스템 설계 문서](./docs/system-design.md): 과업 정의, 페르소나와 시스템 프롬프트, Few-shot 예시 3쌍, 검증 질문 5개와 판정, 프롬프트 v1과 v2를 담았습니다.
3. [실행 로그](./docs/run-log.md): Opus와 나눈 10턴 대화 원문, 확인 결과, 작업 기록, BONUS 3 호출 기록입니다.
4. [미해결 기록](./docs/unresolved.md): DeepSeek에 작업표를 두 번 고쳐 달라고 해도 풀리지 않은 문제 2건입니다.

## Appendix

- [판단 근거 페이지](https://imyesung.github.io/codyssey-ai-native/1-1/responses/)는 모델 선정, 답변 채점, 프롬프트 수정, 미해결 과제에서 내린 판단과 근거를 한 화면에 모은 웹페이지입니다. 파일 목록에서 `responses/index.html`을 열면 HTML 코드로 보입니다.
- [모델별 응답](./responses/)은 문서가 근거로 인용한 응답 원문입니다. `responses/*/docs/`는 각 모델이 만든 빈 양식이며 제출 문서가 아닙니다.
- [모델 비교 보고서 PDF](./appendix/model-comparison.pdf)는 1번 문서를 인쇄용으로 조판한 판입니다.
