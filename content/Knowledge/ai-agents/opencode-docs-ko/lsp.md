# LSP 서버

OpenCode는 LSP 서버와 통합됩니다.

OpenCode는 Language Server Protocol(LSP)과 통합하여 LLM이 코드베이스와 상호 작용하는 데 도움을 줍니다. 진단을 사용하여 LLM에 피드백을 제공합니다.

---

## 내장

OpenCode에는 인기 있는 언어를 위한 여러 내장 LSP 서버가 함께 제공됩니다:

| LSP 서버 | 확장자 | 요구 사항 |
|----------|--------|----------|
| astro | .astro | Astro 프로젝트에 자동 설치 |
| bash | .sh, .bash, .zsh, .ksh | bash-language-server 자동 설치 |
| clangd | .c, .cpp, .cc, .cxx, .c++, .h, .hpp | C/C++ 프로젝트에 자동 설치 |
| csharp | .cs | `.NET SDK` 설치됨 |
| dart | .dart | `dart` 명령 사용 가능 |
| deno | .ts, .tsx, .js, .jsx, .mjs | `deno` 명령 사용 가능 (deno.json/deno.jsonc 자동 감지) |
| eslint | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue | 프로젝트에 `eslint` 의존성 |
| gopls | .go | `go` 명령 사용 가능 |
| jdtls | .java | `Java SDK (버전 21+)` 설치됨 |
| lua-ls | .lua | Lua 프로젝트에 자동 설치 |
| pyright | .py, .pyi | `pyright` 의존성 설치됨 |
| rust | .rs | `rust-analyzer` 명령 사용 가능 |
| svelte | .svelte | Svelte 프로젝트에 자동 설치 |
| typescript | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts | 프로젝트에 `typescript` 의존성 |
| vue | .vue | Vue 프로젝트에 자동 설치 |
| yaml-ls | .yaml, .yml | Red Hat yaml-language-server 자동 설치 |
| zls | .zig, .zon | `zig` 명령 사용 가능 |

위의 파일 확장자 중 하나가 감지되고 요구 사항이 충족되면 LSP 서버가 자동으로 활성화됩니다.

> **Note**: `OPENCODE_DISABLE_LSP_DOWNLOAD` 환경 변수를 `true`로 설정하여 자동 LSP 서버 다운로드를 비활성화할 수 있습니다.

---

## 작동 방식

opencode가 파일을 열면:

1. 활성화된 모든 LSP 서버에 대해 파일 확장자를 확인합니다.
2. 아직 실행 중이지 않은 경우 적절한 LSP 서버를 시작합니다.

---

## 설정

opencode 설정의 `lsp` 섹션을 통해 LSP 서버를 사용자 정의할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {}
}
```

각 LSP 서버는 다음을 지원합니다:

| 속성 | 타입 | 설명 |
|------|------|------|
| `disabled` | boolean | LSP 서버를 비활성화하려면 `true`로 설정 |
| `command` | string[] | LSP 서버를 시작하는 명령 |
| `extensions` | string[] | 이 LSP 서버가 처리해야 할 파일 확장자 |
| `env` | object | 서버 시작 시 설정할 환경 변수 |
| `initialization` | object | LSP 서버에 보낼 초기화 옵션 |

### LSP 서버 비활성화

**모든** LSP 서버를 전역적으로 비활성화하려면 `lsp`를 `false`로 설정합니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": false
}
```

**특정** LSP 서버를 비활성화하려면 `disabled`를 `true`로 설정합니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "typescript": {
      "disabled": true
    }
  }
}
```

### 사용자 정의 LSP 서버

명령과 파일 확장자를 지정하여 사용자 정의 LSP 서버를 추가할 수 있습니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"]
    }
  }
}
```

---

## 추가 정보

### PHP Intelephense

PHP Intelephense는 라이선스 키를 통해 프리미엄 기능을 제공합니다. 다음 텍스트 파일에 (키만) 라이선스 키를 배치하여 제공할 수 있습니다:

- macOS/Linux: `$HOME/intelephense/licence.txt`
- Windows: `%USERPROFILE%/intelephense/licence.txt`

파일에는 추가 콘텐츠 없이 라이선스 키만 포함되어야 합니다.
