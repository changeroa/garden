# 문제 해결

일반적인 문제와 해결 방법.

OpenCode의 문제를 디버그하려면 로그 또는 로컬에 저장된 세션 데이터를 확인할 수 있습니다.

---

## 로그

로그 파일은 다음 위치에 기록됩니다:

- **macOS/Linux**: `~/.local/share/opencode/log/`
- **Windows**: `%USERPROFILE%\.local\share\opencode\log\`

로그 파일은 타임스탬프로 이름이 지정됩니다(예: `2025-01-09T123456.log`). 최근 10개의 로그 파일이 유지됩니다.

더 자세한 디버그 정보를 얻으려면 `--log-level` 명령줄 옵션으로 로그 수준을 설정할 수 있습니다. 예: `opencode --log-level DEBUG`.

---

## 저장소

opencode는 세션 데이터 및 기타 애플리케이션 데이터를 다음 위치에 저장합니다:

- **macOS/Linux**: `~/.local/share/opencode/`
- **Windows**: `%USERPROFILE%\.local\share\opencode`

이 디렉토리에는 다음이 포함됩니다:

- `auth.json` - API 키, OAuth 토큰과 같은 인증 데이터
- `log/` - 애플리케이션 로그
- `project/` - 세션 및 메시지 데이터와 같은 프로젝트별 데이터
  - 프로젝트가 Git 저장소 내에 있으면 `./<project-slug>/storage/`에 저장됩니다
  - Git 저장소가 아닌 경우 `./global/storage/`에 저장됩니다

---

## 도움 받기

OpenCode에 문제가 있는 경우:

1. **GitHub에서 이슈 보고**

   버그를 보고하거나 기능을 요청하는 가장 좋은 방법은 GitHub 저장소를 통하는 것입니다:

   [**github.com/sst/opencode/issues**](https://github.com/sst/opencode/issues)

   새 이슈를 만들기 전에 기존 이슈를 검색하여 문제가 이미 보고되었는지 확인하세요.

2. **Discord 가입**

   실시간 도움말 및 커뮤니티 토론을 위해 Discord 서버에 가입하세요:

   [**opencode.ai/discord**](https://opencode.ai/discord)

---

## 일반적인 문제

몇 가지 일반적인 문제와 해결 방법입니다.

### OpenCode가 시작되지 않음

1. 오류 메시지에 대한 로그 확인
2. `--print-logs`로 실행하여 터미널에서 출력 확인
3. `opencode upgrade`로 최신 버전인지 확인

### 인증 문제

1. TUI에서 `/connect` 명령으로 다시 인증 시도
2. API 키가 유효한지 확인
3. 네트워크가 제공자의 API에 대한 연결을 허용하는지 확인

### 모델을 사용할 수 없음

1. 제공자로 인증했는지 확인
2. 설정의 모델 이름이 올바른지 확인
3. 일부 모델은 특정 액세스 또는 구독이 필요할 수 있음

`ProviderModelNotFoundError`가 발생하면 어딘가에서 모델을 잘못 참조하고 있을 가능성이 높습니다. 모델은 `<providerId>/<modelId>` 형식으로 참조해야 합니다.

예시:
- `openai/gpt-4.1`
- `openrouter/google/gemini-2.5-flash`
- `opencode/kimi-k2`

액세스할 수 있는 모델을 확인하려면 `opencode models`를 실행합니다.

### ProviderInitError

ProviderInitError가 발생하면 설정이 잘못되었거나 손상되었을 가능성이 높습니다.

해결 방법:

1. 먼저 [제공자 가이드](/docs/providers)를 따라 제공자가 올바르게 설정되어 있는지 확인합니다.

2. 문제가 지속되면 저장된 설정을 지웁니다:

```bash
rm -rf ~/.local/share/opencode
```

3. TUI에서 `/connect` 명령을 사용하여 제공자로 다시 인증합니다.

### Linux에서 복사/붙여넣기가 작동하지 않음

Linux 사용자는 복사/붙여넣기 기능이 작동하려면 다음 클립보드 유틸리티 중 하나를 설치해야 합니다:

**X11 시스템의 경우:**

```bash
apt install -y xclip
# 또는
apt install -y xsel
```

**Wayland 시스템의 경우:**

```bash
apt install -y wl-clipboard
```

**헤드리스 환경의 경우:**

```bash
apt install -y xvfb
# 그리고 실행:
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=:99.0
```

opencode는 Wayland를 사용하는지 감지하고 `wl-clipboard`를 선호합니다. 그렇지 않으면 `xclip` 및 `xsel` 순서로 클립보드 도구를 찾습니다.
