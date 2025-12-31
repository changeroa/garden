# Slack Bolt Dependency Injection과 Closure 패턴

Created: 2025-12-30 14:18
Modified: 2025-12-30 14:18
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #slack-bolt #dependency-injection #closure #python
Up:: [[ai-agents/slack/_Overview]]
Related::

---

> [!note]- Original Content
> 
> # 🚨 Slack Bolt: "model is not a valid argument" 에러 분석
> 
> Slack Bolt 프레임워크를 사용하여 봇을 개발하던 중, 커스텀 인자를 핸들러에 전달하려다 발생한 `model is not a valid argument` 에러의 원인과 해결 방법을 정리한 문서입니다.
> 
> ## 1. 문제 상황
> 
> Slack AI Hub 봇 실행 중 `/g-4o-mini` 등의 커맨드를 호출했을 때, 아래와 같은 에러가 발생하며 핸들러가 실행되지 않았습니다.
> 
> Plaintext
> 
> ```
> TypeError: model is not a valid argument
> ```
> 
> ---
>
> ## 2. 원인 분석
> 
> ### 2.1 문제의 코드
> 
> 핸들러 함수 `handle`의 파라미터에 `model`이라는 커스텀 변수를 기본값 인자로 정의한 것이 원인이었습니다.
> 
> Python
> 
> ```
> def _register_model_command(self, app, model_name: str):
>     # ❌ 문제 발생 위치: model=model_name
>     async def handle(ack, command, respond, model=model_name): 
>         await ack()
>         context = CommandContext(command=f"/{model}", ...)
>         await self._chat_handler(context, ack, respond)
> 
>     app.command(f"/{model_name}")(handle)
> ```
> 
> ### 2.2 Slack Bolt의 의존성 주입 시스템
> 
> Slack Bolt는 핸들러 함수를 호출할 때 **함수의 파라미터 이름(Signature)을 분석하여 값을 주입**합니다.
> 
> Bolt가 인식하고 주입할 수 있는 인자들은 정해져 있습니다:
> 
> - `ack`, `respond`, `say`
>     
> - `command`, `event`, `body`
>     
> - `client`, `logger` 등
>     
> 
> 핸들러가 호출되면 Bolt는 다음 과정을 거칩니다:
> 
> 1. 핸들러 함수의 **파라미터 이름**들을 추출합니다.
>     
> 2. 각 이름이 Bolt가 제공하는 `available_args` 목록에 있는지 확인합니다.
>     
> 3. 목록에 있다면 값을 주입하고, **없다면 에러를 발생시킵니다.**
>     
> 
> ### 2.3 에러 발생 과정
> 
> 작성한 `handle` 함수의 파라미터 분석 결과는 다음과 같습니다.
> 
> |**파라미터**|**Bolt 인식 여부**|**결과**|
> |---|---|---|
> |`ack`|✅ Yes|정상 주입|
> |`command`|✅ Yes|정상 주입|
> |`respond`|✅ Yes|정상 주입|
> |**`model`**|❌ **No**|**에러 발생**|
> 
> Bolt는 `model`이라는 파라미터 이름을 보고 값을 주입하려 했으나, 자신이 모르는 인자였기 때문에 `valid argument`가 아니라는 에러를 뱉어낸 것입니다.
> 
> ---
> 
> ## 3. 해결 방법: 클로저(Closure) 활용
> 
> Bolt의 의존성 주입 검사를 우회하면서 외부 변수를 사용하기 위해 **클로저**를 사용해야 합니다.
> 
> ### 3.1 수정된 코드
> 
> Python
> 
> ```
> def _register_model_command(self, app, model_name: str):
> 
>     # 1. 바깥 스코프에서 변수 캡처 (클로저 준비)
>     _model = model_name
>     _handler = self._chat_handler
> 
>     # 2. Slack Bolt가 인식하는 파라미터만 선언
>     async def handle(ack, command, respond):
>         await ack()
>         # 3. 캡처해둔 _model 변수 사용 (파라미터로 받지 않음)
>         context = CommandContext(command=f"/{_model}", ...) 
>         await _handler(context, ack, respond)
> 
>     app.command(f"/{model_name}")(handle)
> ```
> 
> ### 3.2 해결 원리
> 
> 클로저는 함수가 정의될 당시의 **환경(Scope)을 기억하는 기술**입니다. 이를 활용하면 `model`을 파라미터로 넘기지 않고도 내부에서 사용할 수 있습니다.
> 
> |**구분**|**수정 전 (파라미터 전달)**|**수정 후 (클로저 캡처)**|
> |---|---|---|
> |**전달 방식**|`def handle(..., model=model_name)`|`_model = model_name` (외부 변수 참조)|
> |**Bolt의 동작**|`model` 파라미터를 해석하려고 시도함|함수 시그니처에 `model`이 없으므로 무시함|
> |**결과**|**에러 발생** (Unknown Argument)|**정상 동작** (변수 값 참조 성공)|
> 
> ---
> 
> ## 4. 핵심 교훈
> 
> ### 4.1 프레임워크의 동작 방식을 이해하라
> 
> Slack Bolt, FastAPI, Pytest와 같이 의존성 주입(DI)을 사용하는 프레임워크에서 **함수 시그니처(파라미터 정의)는 단순한 변수 선언이 아니라 "설정(Configuration)"**입니다. 프레임워크에게 "이 데이터를 달라"고 요청하는 행위임을 명심해야 합니다.
> 
> ### 4.2 클로저 vs 기본값 파라미터
> 
> 일반적인 Python 코딩에서는 기본값 파라미터(`val=default`)가 흔히 쓰이지만, DI 프레임워크 내부에서는 **클로저 패턴**이 훨씬 안전합니다.
> 
> - **방법 1 (기본값 파라미터):** `def fn(x, n=name):` → Bolt가 `n`을 해석하려 하여 에러 위험.
>     
> - **방법 2 (클로저):** `_n = name; def fn(x):` → Bolt는 `x`만 보고, 함수 내부는 `_n`을 참조. **(권장)**

---

Slack Bolt의 Dependency Injection은 핸들러 함수의 파라미터 이름을 분석하여 값을 주입하는 시스템으로, 커스텀 인자 전달 시 클로저 패턴을 사용해야 한다.

---

## Core Idea
Slack Bolt는 핸들러 함수 호출 시 파라미터 이름(Signature)을 분석하여 ack, respond, command 등 미리 정의된 값을 자동 주입한다.
프레임워크가 인식하지 못하는 커스텀 파라미터가 있으면 'not a valid argument' 에러가 발생한다.
외부 변수를 핸들러에 전달하려면 기본값 파라미터 대신 클로저를 사용해 스코프를 캡처해야 한다.

## Why It Matters
- DI 프레임워크에서 함수 시그니처는 단순한 변수 선언이 아닌 '설정(Configuration)'이다.
- FastAPI, Pytest 등 유사한 DI 패턴을 사용하는 프레임워크에서도 동일한 문제가 발생할 수 있다.
- 클로저 패턴은 프레임워크의 내부 검증을 우회하면서도 안전하게 외부 값을 사용할 수 있게 한다.

## Explanation
- 문제 코드: `async def handle(ack, command, respond, model=model_name)` - Bolt가 model을 해석하려 시도해 에러 발생
- 해결 코드: `_model = model_name; async def handle(ack, command, respond): ... _model 사용` - 클로저로 캡처
- 클로저는 함수가 정의될 당시의 환경(Scope)을 기억하므로, 파라미터 없이도 외부 변수 참조 가능

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: Slack Bolt에서 'model is not a valid argument' 에러가 발생하는 원인은?
- A: 핸들러 파라미터에 Bolt가 인식하지 못하는 커스텀 변수(model)를 선언했기 때문. Bolt는 파라미터 이름을 분석해 DI를 수행하므로 미등록 파라미터는 에러 발생
- Q: DI 프레임워크에서 외부 변수를 핸들러에 전달하는 안전한 방법은?
- A: 클로저 패턴 사용 - 외부 스코프에서 변수를 캡처하고, 핸들러 파라미터에는 프레임워크가 인식하는 것만 선언
