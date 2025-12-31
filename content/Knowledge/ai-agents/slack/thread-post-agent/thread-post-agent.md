이 문서는 src/slack/bot.py에 구현된 Slack 봇의 구조를 이해하고, 더 나은 설계를 위해 학습해야 할 핵심 개념들을 정리했습니다.

## 1. 핵심 기술 스택 (Core Tech Stack)

이 코드를 이해하기 위해서는 다음 기술들에 대한 기본 지식이 필요합니다.

### 1.1 Slack Bolt for Python (`slack_bolt`)

[[Code]]

- **개념**: Slack 앱을 빠르고 쉽게 구축하기 위한 공식 프레임워크입니다.
- **코드 내 활용**:
    - [[`AsyncApp`]]: 비동기 방식으로 Slack 이벤트를 처리하는 핵심 객체입니다.
    - **Decorators (`@app.action`, `@app.view`)**: 특정 이벤트(버튼 클릭, 모달 제출 등)가 발생했을 때 실행될 함수를 등록하는 데 사용됩니다.
    - **참고**: `slack_sdk`는 저수준 API 클라이언트이고, `slack_bolt`는 이를 감싸 이벤트 라우팅 등을 제공하는 고수준 프레임워크입니다.

### 1.2 Socket Mode (`slack_bolt.adapter.socket_mode`)

- **개념**: Slack 서버와 봇 서버 간의 통신 방식입니다. 봇 서버가 방화벽 뒤에 있거나 공인 IP가 없어도 웹소켓(WebSocket)을 통해 양방향 통신이 가능합니다.
- **장점**: 개발 환경이나 내부망 서버에서 별도의 터널링(ngrok 등) 없이 바로 봇을 실행할 수 있습니다.
- **코드 내 활용**: `AsyncSocketModeHandler`를 사용하여 연결을 수립합니다.

### 1.3 Asynchronous Python (`asyncio`)

- **개념**: Python의 비동기 프로그래밍 라이브러리입니다. I/O 작업(네트워크 요청 등) 중에 다른 작업을 차단하지 않고 수행합니다.
- **필수 키워드**: `async def`, `await`, `asyncio.Future`

### 1.4 Configuration Management (`pydantic-settings`)

- **개념**: 환경 변수(`.env`)를 Python 객체로 매핑하여 타입 안전성을 보장하고 관리하기 쉽게 해줍니다.
- **코드 내 활용**: 
    
    config/settings.py의 
    
    Settings 클래스가 `slack_bot_token`, `slack_app_token` 등을 관리합니다.
- **주요 설정값**:
    - `slack_bot_token` (`xoxb-...`): 봇 유저로서 메시지를 보내는 데 사용.
    - `slack_app_token` (`xapp-...`): Socket Mode 연결을 위해 사용.
    - `slack_channel_id`: 봇이 메시지를 보낼 기본 채널.

---

## 2. 주요 설계 패턴 및 구현 분석

이 봇의 가장 독특하고 중요한 설계 특징은 **"이벤트 기반(Event-driven) 상호작용을 선형적(Linear) 흐름으로 변환"**하는 방식입니다.

### 2.1 Asyncio Future를 이용한 흐름 제어 (핵심!)

보통 Slack 봇은 "이벤트 -> 핸들러 실행 -> 종료"의 구조를 가집니다. 하지만 이 봇은 **"워크플로우가 유저의 응답을 기다리는"** 구조로 되어 있습니다.

#### 작동 원리:

1. **요청 (**
    
    **send_approval_request)**:
    
    - 봇이 Slack에 버튼이 달린 메시지를 보냅니다.
    - `asyncio.Future()` 객체를 생성하여 `self._pending_responses` 딕셔너리에 저장합니다 (Key는 메시지 ID 등).
    - `await asyncio.wait_for(future)`를 호출하여 **코드 실행을 여기서 멈추고 기다립니다.**
2. **응답 처리 (**
    
    **handle_approve / 
    
    handle_reject)**:
    
    - 유저가 Slack에서 버튼을 클릭하면 `@app.action` 핸들러가 실행됩니다.
    - 핸들러는 `self._pending_responses`에서 해당 요청의 Future 객체를 찾습니다.
    - `future.set_result(value)`를 호출하여 멈춰있던 Future에 값을 넣어줍니다.
3. **재개 (Resume)**:
    
    - Future에 값이 설정되면, 멈춰있던 
        
        send_approval_request 함수가 다시 깨어나서 값을 반환하고 다음 로직을 수행합니다.

**이 개념이 왜 중요한가요?** 이 패턴 덕분에 복잡한 콜백(Callback) 지옥 없이, 코드를 순차적으로(`step 1 -> user input -> step 2`) 작성할 수 있습니다. LangGraph와 같은 워크플로우 엔진과 연동하기 위해 필수적인 패턴입니다.

### 2.2 Singleton Pattern

- get_slack_bot() 함수와 `_bot_instance` 변수를 사용하여 앱 전체에서 단 하나의 봇 인스턴스만 생성되고 공유되도록 보장합니다.

---

## 3. UI/UX: Slack Block Kit

Slack 봇의 "화면"을 구성하는 기술입니다.

- **Blocks**: 메시지를 구성하는 레고 블록 같은 단위입니다 (`section`, `actions`, `header`, `divider` 등).
- **Interactivity**:
    - `buttons`: 유저의 입력을 받는 기본 도구입니다 (
        
        handle_approve 등에서 처리).
    - **Modals (`views_open`)**: 거절 사유를 입력받을 때처럼 팝업 창을 띄워 복잡한 입력을 받습니다.
    - `mrkdwn`: Slack 전용 마크다운 문법으로 텍스트를 꾸밉니다 (`*bold*`, `_italic_` 등).

---

## 4. 설계를 더 정교하게 만들기 위해 고민할 점 (Refinement Areas)

현재 코드를 더 발전시키기 위해 학습하고 적용해볼 수 있는 개념들입니다.

### 4.1 상태 지속성 (State Persistence)

- **문제점**: 봇 서버가 재시작되면메모리에 있던 `_pending_responses`가 사라집니다. 유저가 버튼을 눌러도 봇은 기다리고 있던 Future를 찾지 못해 에러가 나거나 무반응이 됩니다.
- **해결 방안**: Redis나 DB를 도입하여 대기 상태를 영구 저장하거나, Stateless하게 설계하는 방법을 고민해야 합니다.

### 4.2 타임아웃 및 예외 처리

- 현재 `asyncio.wait_for`로 타임아웃을 처리하고 있지만, 타임아웃 발생 시 Slack 메시지를 업데이트하여 유저에게 "만료됨"을 시각적으로 알리는 UX 로직이 더 정교해질 필요가 있습니다.

### 4.3 동시성 제어 (Concurrency Control)

- 여러 워크플로우가 동시에 실행될 때 `_pending_responses`의 키(Key) 생성 규칙(`message_ts` 사용)이 충돌하지 않는지, 원자성(Atomicity)이 보장되는지 확인해야 합니다.

### 4.4 Block Kit Builder 활용

- JSON을 직접 코딩하는 것은 실수가 잦습니다. Slack에서 제공하는 [Block Kit Builder](https://app.slack.com/block-kit-builder)를 사용하여 UI를 시각적으로 설계하고 코드를 가져오는 방법을 익히면 좋습니다.

## 5. 학습 로드맵 제안

1. **Block Kit 개념 익히기**: Slack 공식 문서를 통해 어떤 UI 컴포넌트가 있는지 확인하기.
2. **Python Asyncio 심화**: `Future`, `Event`, `Task`의 차이와 `async/await` 동작 원리 이해하기.
3. **Slack Bolt 튜토리얼**: 공식 "Getting Started"를 따라하며 기본 이벤트 처리 흐름 실습하기.
4. **Bot Design Pattern**: "User Interactive Workflow" 설계 패턴에 대해 리서치하기