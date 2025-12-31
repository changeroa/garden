# CLI

OpenCode CLI 옵션 및 명령.

OpenCode CLI는 기본적으로 인수 없이 실행될 때 [TUI](/docs/tui)를 시작합니다.

```bash
opencode
```

하지만 이 페이지에 문서화된 명령도 받습니다. 이를 통해 OpenCode와 프로그래밍 방식으로 상호 작용할 수 있습니다.

```bash
opencode run "JavaScript에서 클로저가 어떻게 작동하는지 설명해주세요"
```

---

## TUI

OpenCode 터미널 사용자 인터페이스를 시작합니다.

```bash
opencode [project]
```

### 플래그

| 플래그 | 짧은 형태 | 설명 |
|--------|-----------|------|
| `--continue` | `-c` | 마지막 세션 계속 |
| `--session` | `-s` | 계속할 세션 ID |
| `--prompt` | `-p` | 사용할 프롬프트 |
| `--model` | `-m` | provider/model 형식의 모델 |
| `--agent` | - | 사용할 에이전트 |
| `--port` | - | 수신 대기할 포트 |
| `--hostname` | - | 수신 대기할 호스트 이름 |

---

## 명령

### run

비대화형 모드에서 프롬프트를 직접 전달하여 opencode를 실행합니다.

```bash
opencode run [message..]
```

스크립팅, 자동화 또는 전체 TUI를 시작하지 않고 빠른 답변을 원할 때 유용합니다.

```bash
opencode run Go에서 컨텍스트 사용법 설명
```

### serve

API 액세스를 위한 헤드리스 OpenCode 서버를 시작합니다. [서버 문서](/docs/server)에서 전체 HTTP 인터페이스를 확인하세요.

```bash
opencode serve
```

TUI 인터페이스 없이 opencode 기능에 대한 API 액세스를 제공하는 HTTP 서버를 시작합니다.

### models

구성된 제공자에서 사용 가능한 모든 모델을 나열합니다.

```bash
opencode models [provider]
```

구성된 제공자 전체에서 사용 가능한 모든 모델을 `provider/model` 형식으로 표시합니다.

[설정](/docs/config/)에서 사용할 정확한 모델 이름을 파악하는 데 유용합니다.

### auth

제공자에 대한 자격 증명 및 로그인을 관리하는 명령입니다.

```bash
opencode auth [command]
```

**login** - API 키 구성

```bash
opencode auth login
```

**list** - 인증된 제공자 나열

```bash
opencode auth list
```

**logout** - 제공자에서 로그아웃

```bash
opencode auth logout
```

### upgrade

opencode를 최신 버전 또는 특정 버전으로 업데이트합니다.

```bash
opencode upgrade [target]
```

최신 버전으로 업그레이드:

```bash
opencode upgrade
```

특정 버전으로 업그레이드:

```bash
opencode upgrade v0.1.48
```

---

## 전역 플래그

opencode CLI는 다음 전역 플래그를 받습니다.

| 플래그 | 짧은 형태 | 설명 |
|--------|-----------|------|
| `--help` | `-h` | 도움말 표시 |
| `--version` | `-v` | 버전 번호 출력 |
| `--print-logs` | - | stderr로 로그 출력 |
| `--log-level` | - | 로그 수준 (DEBUG, INFO, WARN, ERROR) |

---

## 환경 변수

OpenCode는 환경 변수를 사용하여 구성할 수 있습니다.

| 변수 | 타입 | 설명 |
|------|------|------|
| `OPENCODE_AUTO_SHARE` | boolean | 자동으로 세션 공유 |
| `OPENCODE_GIT_BASH_PATH` | string | Windows에서 Git Bash 실행 파일 경로 |
| `OPENCODE_CONFIG` | string | 설정 파일 경로 |
| `OPENCODE_CONFIG_DIR` | string | 설정 디렉토리 경로 |
| `OPENCODE_CONFIG_CONTENT` | string | 인라인 json 설정 내용 |
| `OPENCODE_DISABLE_AUTOUPDATE` | boolean | 자동 업데이트 확인 비활성화 |
| `OPENCODE_DISABLE_PRUNE` | boolean | 오래된 데이터 정리 비활성화 |
| `OPENCODE_CLIENT` | string | 클라이언트 식별자 (기본값: `cli`) |
| `OPENCODE_ENABLE_EXA` | boolean | Exa 웹 검색 도구 활성화 |

### 실험적

이러한 환경 변수는 변경되거나 제거될 수 있는 실험적 기능을 활성화합니다.

| 변수 | 타입 | 설명 |
|------|------|------|
| `OPENCODE_EXPERIMENTAL` | boolean | 모든 실험적 기능 활성화 |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | boolean | 실험적 LSP 도구 활성화 |
