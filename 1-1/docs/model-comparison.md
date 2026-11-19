# LLM 모델 비교와 선정 보고서

[모델 3종에 똑같이 보낼 지시문과 입력 자료](system-design.md#유저-프롬프트-v1)

| 모델과 추론 설정 | 실행 시점 (KST) | 무료 요금제로 사용 가능 여부 |
| --- | --- | --- |
| Claude Opus 5.5 / Max | 2026-11-19 12:52:15 | 이번 실행은 유료 구독 |
| ChatGPT GPT-6.2 Astra / Max (Work) | 2026-11-19 12:51:32 | 이번 실행은 유료 구독 |
| DeepSeek V4.1 Flash / DeepThink OFF | 2026-11-19 12:52:54 | 무료 웹 채팅에서 실행 |

**비교할 이유**

프로그래밍에 관심을 가지게 된 이유 중 하나는 투명하고 재현 가능한 도구를 스스로 골라 쓰고 싶어서였다.
그런데 정작 LLM이 필요할 때는 별생각 없이 늘 쓰던 구독 서비스를 열곤 한다.
이에 아래와 같은 질문들을 미션 수행에 적용해보고 싶다.

- 수행할 태스크에 유료 서비스가 필요한가?
- 가중치가 공개된 모델을 사용할 경우에도 충분히 태스크 수행이 가능한가?
- 가중치가 어떤 영향을 주는지 스스로 감각 및 인지할 수 있는가?

이번에는 웹에서 쓸 수 있는 3가지 모델에 같은 미션 원문(`1-1_spec.md`)을 주고 결과를 비교해 보려 한다.
각 모델이 PASS 조건을 얼마나 정확히 옮기는지, 제시한 양식과 작업 순서를 실제 미션에 그대로 쓸 수 있는지 살펴본다.
가중치가 공개된 모델을 직접 운영했을 때 같은 작업에서 어느 정도의 품질을 얻을 수 있는지, 비용은 얼마나 드는지는 후속 실험에서 확인한다.

DeepSeek은 2026년 10월 17일 공식 웹을 `V4.1-Flash-1017`로 갱신했다고 밝혔다. 이 버전의 모델 카드는 가중치에 MIT 라이선스를 적용하며 문맥 길이를 100만 토큰으로 명시한다. 실행 화면에 버전이 없으면 그날 본 모드 이름과 공지 기준 버전을 함께 기록한다. [공식 변경 기록](https://api-docs.deepseek.com/updates/) [공식 모델 카드](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017) [확인한 가중치 저장소 리비전](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017/tree/08c8657f02291e11b6f6b63e0e16014f8e748518)

## 모델별 실제 응답

### Claude Opus 5.5 / Max

파일과 폴더 이름을 예시로 표시했다. 점검 항목 34개와 복사용 프롬프트를 문서 1개에 담았다. 작업표에서는 입력 자료 샘플 3건을 모으고, 문서 4개 외에 README까지 빈 양식 5개를 만들도록 했다. 원문은 Few-shot 예시 3건을 요구하고 README는 선택으로 둔다. [Claude가 완성한 안내서](../responses/claude-opus-5.5_max/guide.md) [최종 발화](../responses/claude-opus-5.5_max/reply.md)

### ChatGPT GPT-6.2 Astra / Max (Work)

원문이 정한 문서의 종류와 예시 파일명을 구별했다. 빈 Markdown 파일 4개는 안내서에 실린 양식과 한 글자씩 대조해 모두 일치했다. 압축은 내려받기 편의를 위한 형식이다. 채점에는 각 파일의 내용과 표 구조를 사용했다. [채팅 응답](../responses/chatgpt-gpt-6.2-astra_max/reply.md) [비교 양식](../responses/chatgpt-gpt-6.2-astra_max/docs/model-comparison.md) [설계 양식](../responses/chatgpt-gpt-6.2-astra_max/docs/system-design.md) [로그 양식](../responses/chatgpt-gpt-6.2-astra_max/docs/run-log.md) [미해결 양식](../responses/chatgpt-gpt-6.2-astra_max/docs/unresolved.md)

### DeepSeek V4.1 Flash

문서 4개의 빈 양식과 25행 작업표, 복사용 프롬프트 3개를 채팅에 썼다. 트리에서 영문 파일명 4개를 모두 고정 이름이라고 했다. 첫 응답을 채점한 뒤 순서표 수정을 2차례 요청했다. [첫 응답](../responses/deepseek-v4.1-flash_deepthink-off/reply.md) [첫 수정](../responses/deepseek-v4.1-flash_deepthink-off/revision-1.md) [두 번째 수정](../responses/deepseek-v4.1-flash_deepthink-off/revision-2.md)

## 채점 기준을 정한 이유

과제 안내는 모델 3종 이상을 같은 기준 4개 이상으로 비교하고 점수마다 근거를 적도록 한다. 원문의 1~5점은 결과 예시에 나온 척도다. 이번 비교에서는 공통 지시문이 요구한 제출 트리, 복사할 빈 양식, 위에서부터 따라갈 작업 순서를 각각 한 항목으로 삼았다. 결과물 3개에 공통으로 필요한 원문 조건 보존을 더해 항목 4개에 5점씩 배정했다. 같은 표가 있어도 파일명이 필수인지 잘못 읽을 수 있고, 원문을 정확히 옮겨도 작업 순서가 뒤집힐 수 있기 때문이다. 결과물을 나눠 항목마다 점수의 뜻을 정하는 방법은 카네기멜런대의 루브릭 안내에서, 요구사항을 출처와 검증 방법에 연결하는 방법은 NASA의 요구사항 검증표에서 확인할 수 있다. 항목 이름과 배점은 이번 과업에 맞춰 정했다. 과제의 비교 요건은 4장 2번, 점수 예시는 8장에서 확인할 수 있다. [코디세이 과제 전문 (Login 필요)](https://usr.codyssey.kr/learning/learningMap?projectNo=164003) [공통 지시문](system-design.md#유저-프롬프트-v1) [카네기멜런대 Eberly Center, Grading and Performance Rubrics](https://www.cmu.edu/teaching/designteach/teach/rubrics.html) [NASA Systems Engineering Handbook, 부록 D](https://www.nasa.gov/reference/system-engineering-handbook-appendix/#hds-sidebar-nav-8)

| 점수 | 이 결과를 실제 과제에 쓸 때 |
| --- | --- |
| 5 | 그대로 사용할 수 있다. |
| 4 | 한 곳을 조금 고치면 사용할 수 있다. |
| 3 | 여러 곳을 손봐야 한다. |
| 2 | 필수 규격이나 핵심 작업 순서가 틀렸다. |
| 1 | 다시 작성해야 한다. |

대학생 프로그래밍 대회 ICPC(International Collegiate Programming Contest)가 풀이마다 정답 여부를 먼저 판정하는 방식에서 착안해, 이 보고서에는 모델별 총점과 별도로 필수 조건 위반 여부를 판정해 적었다. [ICPC 세계 결선 공식 규정](https://worldfinals.icpc.global/2026/about/)

**비교 환경**

웹 대화 3개에서 보낸 입력은 모두 22,562바이트였고 SHA-256도 일치했다.

| 웹 검색 사용 | Claude | ChatGPT | DeepSeek |
| --- | --- | --- | --- |
| 결과 | X<br>(이전 채팅 활용) | X<br>(작업 파일 검색) | X |

Claude는 코디세이 메모리와 이전 채팅을 찾았다. ChatGPT는 작업 폴더의 파일을 검색했다. 각각 실행 화면에서 활동 기록을 펼쳐 확인했다. DeepSeek은 Search를 끈 채 실행했다.

추론 설정은 같지 않았다. Claude와 ChatGPT는 가장 높은 설정인 Max로 실행했고, DeepSeek은 DeepThink를 끈 채 실행했다. 그래서 이번 점수 차이에는 모델의 차이와 추론 설정의 차이가 함께 들어 있다.

## 내 채점

점수와 선정 이유는 2026년 11월 19일 판단 근거 페이지에서 저장한 값이다. 이 페이지에서는 내 채점과 각 모델의 답을 같은 자리에서 비교할 수 있다. 공개한 페이지에는 과제 원문을 싣지 않았고, 인용한 곳은 행 번호로만 표시했다. [판단 근거 페이지](https://imyesung.github.io/codyssey-ai-native/1-1/responses/) ‘빈 양식과 표 보존’에서 Claude와 ChatGPT는 점수만 입력했다. 이 2칸에는 실제 파일에서 확인한 내용을 ‘원문 대조’로 표시했다.

| 비교 기준 | Claude Opus 5.5 / Max | ChatGPT GPT-6.2 Astra / Max | DeepSeek V4.1 Flash | 근거 |
| --- | --- | --- | --- | --- |
| 원문 조건 보존 | `2/5`점 | `3/5`점 | `2/5`점 | Claude: 미션 원문은 Hallucination을 "사실과 다른 대답"이라고 정의한다.<br>Claude는 작업순서 E8에서 "환각 지점은 Fail로 판정한 답변과 그 밖에 사실과 다른 대답"으로 정의하여, 원문이 정의한 Hallucination을 확대 정의하므로 필수 규격에 오류가 있다고 볼 수 있다.<br>ChatGPT: 원문 조건은 잘 반영되어 있으나, 스스로 추가한 원본 참고를 위한 하이퍼링크가 연결되어 있지 않아 수정 필요하다. 한국어 문장이 전반적으로 매끄럽지 않아 사소한 수정 공수가 많이 들 것으로 보임.<br>DeepSeek: '키를 발급하지 못한 경우도 그 사실을 적으면 충족'한다는 경우를 단순히 "미발급도 충족"한다고 기재하며, 원문의 키 미발급 사실 기재 요구를 누락함. ([첫 응답 359행 조건 점검표](../responses/deepseek-v4.1-flash_deepthink-off/reply.md?plain=1#L359)) |
| 제출 트리 정확성 | `5/5`점 | `5/5`점 | `2/5`점 | Claude: 채점에 용이한 자료들을 직접 반영한 폴더 트리를 제공하여 퀄리티가 높음 ([안내서 1장](../responses/claude-opus-5.5_max/guide.md#1-제출-폴더와-파일-트리))<br>ChatGPT: 군더더기 없이 요구사항을(혹은 만) 정확히 충족함 ([채팅 응답 1장](../responses/chatgpt-gpt-6.2-astra_max/reply.md#1-제출할-폴더와-파일))<br>DeepSeek: 참고용 예시 파일명을 '원문 고정'으로 표기함 ([첫 응답 13~16행](../responses/deepseek-v4.1-flash_deepthink-off/reply.md?plain=1#L13-L16)) |
| 빈 양식과 표 보존 | `5/5`점 | `5/5`점 | `3/5`점 | **Claude 원문 대조**　비교표의 열 5개와 빈 행 4개를 살리고 작성 예시는 표 밖의 주석에 뒀다. [비교표](../responses/claude-opus-5.5_max/docs/model-comparison.md#4-비교표)<br>**ChatGPT 원문 대조**　비교표의 열 5개를 보존했다. 검증표에는 ‘원자료에서 확인한 정답과 근거 위치’, ‘실행 로그의 응답 턴’, ‘직접 판정’이 분리된 빈 행 5개가 있다. [검증표](../responses/chatgpt-gpt-6.2-astra_max/docs/system-design.md#환각-검증-질문과-판정)<br>DeepSeek: 기초적 요구는 충족했으나 \`\`\`를 중복 사용하며 완성도가 떨어지는 양식을 제공하였음. ([첫 응답 91행, 176행, 204행](../responses/deepseek-v4.1-flash_deepthink-off/reply.md?plain=1#L91)에서 안쪽 \`\`\`가 바깥 양식 블록을 닫음)<br>오름차순으로 숫자가 반복될 경우 생략함 |
| 작업 순서의 실행 가능성 | `3/5`점 | `2/5`점 | `1/5`점 | Claude: 작업 순서를 커밋 메시지와 같이, 어떤 액션이 이루어졌는지 명시해주어 파악하기 쉬웠음. 하지만 그 행동을 왜 해야 하는지가 작업 순서 한 줄에 더 녹아있도록 여러 수정이 필요해보임. ([안내서 3장 작업 순서표](../responses/claude-opus-5.5_max/guide.md#3-작업-순서표))<br>ChatGPT: 전반적으로 장황하며, 한 줄에 행동 하나가 아니라, 여러 열의 판단 정보들이 포함되어 있어 '작업 순서'를 요청한 유저의 의도에 부합하지 않음. ([채팅 응답 3장의 4열 표](../responses/chatgpt-gpt-6.2-astra_max/reply.md#3-위에서부터-따라갈-작업-순서))<br>DeepSeek: 최초 요청 프롬프트에 "한 줄에는 행동 하나"를 요청하였으나, 임의로 여러 태스크들을 묶어 하나의 작업으로 안내함 (예: [첫 응답 작업표 5, 15, 20, 22, 25번](../responses/deepseek-v4.1-flash_deepthink-off/reply.md?plain=1#L264-L292)) |
| 합계 (20점) | `15/20`점 | `15/20`점 | `8/20`점 |  |
| 필수 조건 확인 결과 | 위반 확인 | 확인한 범위에서 없음 | 위반 확인 |  |
| 해당 조건과 응답 원문 | "환각 지점은 Fail로 판정한 답변과 그 밖에 사실과 다른 대답"으로 정의하여, 원문이 정의한 Hallucination을 확대 정의 | 원칙적인 필수 조건은 모두 충족하였음 | 원문의 키 미발급 사실 기재 요구, 예시 파일명 고정 안내 등 필수 조건들을 위반함 |  |

## 선정 결론

Fail을 받은 답을 모두 환각으로 표시하라는 오류가 있었지만, 안내서를 직접 비교해 보니 작업 순서표에서 유저가 언제 무엇을 판단해야 하는지 가장 잘 보여 Claude Opus 5.5를 골랐다.

## GPT-6.2 Astra Ultra 채점 (참고용)

2026년 11월 19일 13시 56분 KST에 별도 Ultra 세션에서 모델 3종의 첫 응답을 채점했다. 내가 원문을 검토할 때 참고하려고 받은 점수다. 채점 메모와 인용한 문장을 함께 보관했다. [항목별 원문 대조](https://imyesung.github.io/codyssey-ai-native/1-1/responses/) [Ultra 채점 원문](../responses/reference-codex-gpt-6.2-astra_ultra/assessment.json)

| 비교 기준 | Claude Opus 5.5 / Max | ChatGPT GPT-6.2 Astra / Max | DeepSeek V4.1 Flash | 근거 |
| --- | --- | --- | --- | --- |
| 원문 조건 보존 | [`2/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=claude&criterion=conditions) | [`5/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=chatgpt&criterion=conditions) | [`3/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=deepseek&criterion=conditions) | Claude는 근거만 빠진 정답도 환각으로 표시하게 함.<br>ChatGPT는 근거 누락과 사실 오류를 구분.<br>DeepSeek은 BONUS에서 키를 못 받은 경우를 모두 허용. |
| 제출 트리 정확성 | [`5/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=claude&criterion=tree) | [`5/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=chatgpt&criterion=tree) | [`2/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=deepseek&criterion=tree) | Claude와 ChatGPT는 문서 종류와 예시 파일명을 구분.<br>DeepSeek은 영문 이름 4개를 모두 ‘원문 고정’으로 표시. |
| 빈 양식과 표 보존 | [`5/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=claude&criterion=forms) | [`5/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=chatgpt&criterion=forms) | [`2/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=deepseek&criterion=forms) | Claude와 ChatGPT는 열 5개와 작성 칸을 보존.<br>DeepSeek은 양식 3개에서 안팎에 같은 백틱을 써 복사 블록이 중간에 닫힘. |
| 작업 순서의 실행 가능성 | [`3/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=claude&criterion=sequence) | [`4/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=chatgpt&criterion=sequence) | [`2/5`점](https://imyesung.github.io/codyssey-ai-native/1-1/responses/?model=deepseek&criterion=sequence) | Claude는 A2에 파일 생성과 양식 붙이기를, G4에 업로드와 URL 제출을 묶음.<br>ChatGPT는 37번에 파일 모으기와 업로드를 묶음.<br>DeepSeek은 15번에서 대화를 끝낸 뒤 조건 변경과 반복 입력을 시킴. |
| 합계 (20점) | `15/20`점 | `19/20`점 | `9/20`점 | 항목 4개에 각각 5점 |

### Claude의 ‘원문 조건 보존’이 2점인 이유

첫 모델 비교에서 Claude가 만든 안내서의 3장 「작업 순서표」를 보면 E7에서 검증 질문을 채점하고 E8에서 실행 로그에 환각을 표시한다. 과제 안내 4장 6번은 정답과 근거를 함께 제시하거나, 모른다고 밝히고 확인 절차를 제안하면 Pass로 판정한다. 7번은 환각을 “사실과 다른 대답”으로 정의한다. OpenAI도 “환각은 언어 모델이 생성하는, 그럴듯하지만 잘못된 진술입니다.”라고 설명한다. 과제의 Pass/Fail 기준(과제 원문 147행) 과제의 환각 정의(과제 원문 151행) [OpenAI 「언어 모델이 환각을 일으키는 이유」](https://openai.com/ko-KR/index/why-language-models-hallucinate/)

Claude는 E7에서 근거 없는 정답도 Fail이라고 정확히 설명했다. 그런데 바로 다음 E8에서 “환각 지점은 Fail로 판정한 답변과 그 밖에 사실과 다른 대답이다.”라고 썼다. 예를 들어 제출할 문서 수를 물었을 때 “4개다”라고만 답했다면 수는 맞고 근거가 빠졌다. E7에서 Fail을 주는 것은 맞다. E8의 지시를 따르면 맞는 숫자에도 환각 표시가 붙는다. [Claude 안내서 E7](../responses/claude-opus-5.5_max/guide.md#e7-직접-작성-pass-또는-fail) [Claude 안내서 E8](../responses/claude-opus-5.5_max/guide.md#e8-판단-지점-표시) 제출 문서 수 확인(과제 원문 87행)

Astra Ultra는 과제의 필수 절차인 환각 표시 기준이 달라졌다고 보고 **원문 조건 보존에 `2/5`점**을 줬다. 같은 항목의 채점 메모에는 B4에서 과제 원문에 없는 ‘입력 자료 샘플 3건 모으기’를 추가한 점도 적혀 있다. [2점 기준과 실제 채점 메모](../responses/reference-codex-gpt-6.2-astra_ultra/assessment.json)

이후 본 대화에서는 같은 오류가 다시 나오지 않았다. 본 대화 2턴의 로그 양식은 환각을 ‘사실과 다른 대답’으로 정의했다. [본 대화 2턴 233~238행](../responses/claude-opus-5.5_max/experiment/turn-02.md?plain=1#L233-L238)

## BONUS 3에서 더할 추가 모델

개인 Google Apps Script에서 LG K-EXAONE 2.5를 호출했다. 시스템 설계 문서에서 텍스트 생성으로 분류한 비교 입력을 그대로 보냈다. 매 호출 직전에 웹 모델 3종에 보낸 입력과 해시가 일치하는지 검사한다. LG는 이 버전의 API를 무료로 제공한다고 공지했다. [LG 공지](https://www.lgresearch.ai/news/view?seq=754) [API 명세](https://docs.exaone.ai/en/docs/k-exaone-2.5)

| Ultra 채점 기준 | Claude Opus 5.5 / Max | ChatGPT GPT-6.2 Astra / Max | DeepSeek V4.1 Flash | K-EXAONE 2.5 / Apps Script |
| --- | --- | --- | --- | --- |
| 원문 조건 보존 | `2/5`점 | `5/5`점 | `3/5`점 | `1/5`점 |
| 제출 트리 정확성 | `5/5`점 | `5/5`점 | `2/5`점 | `1/5`점 |
| 빈 양식과 표 보존 | `5/5`점 | `5/5`점 | `2/5`점 | `1/5`점 |
| 작업 순서의 실행 가능성 | `3/5`점 | `4/5`점 | `2/5`점 | `1/5`점 |
| 합계 (20점) | `15/20`점 | `19/20`점 | `9/20`점 | `4/20`점 |

5차 호출에서 표시 규칙을 설명하다 끊긴 답변 102자를 받았다. 트리, 양식, 순서표가 모두 빠졌다. 출력 한도를 달리했을 때의 성능은 이 결과만으로 판단하기 어렵다. [응답 원문](../responses/k-exaone-2.5_low/reply.md) [Ultra 채점 원문](../responses/reference-codex-gpt-6.2-astra_ultra/bonus.json) [BONUS 실행 기록](run-log.md#bonus-3-k-exaone-25-api)

### BONUS 내 채점

K-EXAONE 2.5에는 항목 4개에 각각 `1/5`점을 줬다. 합계는 `4/20`점이다.

| 기준 | K-EXAONE 2.5 / Low | 근거 |
| --- | --- | --- |
| 원문 조건 보존 | `1/5`점 | 원문이 요구하는 바를 전혀 명시하지 못하고 초반의 조건만 명시함 |
| 제출 트리 정확성 | `1/5`점 | 미션이 제안한 구조 구현 실패 |
| 빈 양식과 표 보존 | `1/5`점 | 양식 미출력 |
| 작업 순서의 실행 가능성 | `1/5`점 | 작업 순서 미출력 |
| 합계 (20점) | `4/20`점 |  |
| 필수 조건 | 판단 보류 | 응답 불완전 |
