# OpenCode 한국어 문서

> [OpenCode](https://opencode.ai) 공식 문서의 한국어 번역본입니다.

**OpenCode**는 오픈 소스 AI 코딩 에이전트입니다. 터미널 기반 인터페이스(TUI), 데스크톱 앱, 또는 IDE 확장 프로그램으로 사용할 수 있습니다.

- 공식 사이트: https://opencode.ai
- GitHub: https://github.com/sst/opencode
- Discord: https://opencode.ai/discord

---

## 목차

### 시작하기

| 문서 | 설명 |
|------|------|
| [[index\|소개]] | OpenCode 시작하기 - 설치, 설정, 기본 사용법 |
| [[config\|설정]] | JSON 설정 파일을 사용한 OpenCode 구성 |
| [[providers\|제공자]] | LLM 제공자 설정 (Anthropic, OpenAI, Bedrock 등) |
| [[network\|네트워크]] | 프록시 및 사용자 정의 인증서 구성 |
| [[enterprise\|엔터프라이즈]] | 조직에서 OpenCode를 안전하게 사용 |
| [[troubleshooting\|문제 해결]] | 일반적인 문제와 해결 방법 |
| [[migration-1-0\|1.0 마이그레이션]] | OpenCode 1.0의 새로운 기능 및 변경 사항 |

---

### Usage (사용법)

| 문서 | 설명 |
|------|------|
| [[tui\|TUI]] | 터미널 사용자 인터페이스 사용하기 |
| [[cli\|CLI]] | CLI 옵션 및 명령 |
| [[ide\|IDE]] | VS Code, Cursor 등 IDE 확장 프로그램 |
| [[zen\|Zen]] | OpenCode 팀이 큐레이션한 모델 목록 |
| [[share\|공유]] | OpenCode 대화 공유하기 |
| [[github\|GitHub]] | GitHub 이슈 및 풀 리퀘스트 통합 |
| [[gitlab\|GitLab]] | GitLab 이슈 및 머지 리퀘스트 통합 |

---

### Configure (설정)

| 문서 | 설명 |
|------|------|
| [[tools\|도구]] | LLM이 사용할 수 있는 도구 관리 |
| [[rules\|규칙]] | AGENTS.md를 통한 사용자 정의 지침 설정 |
| [[agents\|에이전트]] | 전문 에이전트 구성 및 사용 |
| [[models\|모델]] | LLM 제공자 및 모델 구성 |
| [[themes\|테마]] | 내장 테마 선택 또는 직접 정의 |
| [[keybinds\|키바인드]] | 키바인드 커스터마이징 |
| [[commands\|명령]] | 반복 작업을 위한 사용자 정의 명령 |
| [[formatters\|포매터]] | 언어별 코드 포매터 설정 |
| [[permissions\|권한]] | 작업 실행에 대한 승인 제어 |
| [[lsp\|LSP 서버]] | Language Server Protocol 통합 |
| [[mcp-servers\|MCP 서버]] | Model Context Protocol 도구 추가 |
| [[acp\|ACP 지원]] | Agent Client Protocol 호환 편집기에서 사용 |
| [[skills\|에이전트 스킬]] | SKILL.md를 통한 재사용 가능한 동작 정의 |
| [[custom-tools\|커스텀 도구]] | LLM이 호출할 수 있는 도구 만들기 |

---

### Develop (개발)

| 문서 | 설명 |
|------|------|
| [[sdk\|SDK]] | opencode 서버용 타입 안전 JS 클라이언트 |
| [[server\|서버]] | HTTP를 통해 opencode 서버와 상호 작용 |
| [[plugins\|플러그인]] | OpenCode 확장을 위한 플러그인 작성 |
| [[ecosystem\|에코시스템]] | 커뮤니티 프로젝트 및 통합 |

---

## 빠른 시작

### 설치

```bash
curl -fsSL https://opencode.ai/install | bash
```

또는 npm으로 설치:

```bash
npm install -g opencode-ai
```

### 실행

```bash
cd /path/to/project
opencode
```

### 초기화

TUI에서 `/init` 명령을 실행하여 프로젝트용 `AGENTS.md` 파일을 생성합니다.

```
/init
```

---

## 주요 명령어

| 명령 | 설명 | 키바인드 |
|------|------|----------|
| `/help` | 도움말 표시 | `ctrl+x h` |
| `/init` | AGENTS.md 생성 | `ctrl+x i` |
| `/models` | 모델 목록 | `ctrl+x m` |
| `/new` | 새 세션 시작 | `ctrl+x n` |
| `/undo` | 마지막 메시지 취소 | `ctrl+x u` |
| `/redo` | 취소된 메시지 복원 | `ctrl+x r` |
| `/share` | 세션 공유 | `ctrl+x s` |
| `/themes` | 테마 목록 | `ctrl+x t` |

---

## 권장 모델

OpenCode와 잘 작동하는 모델 목록:

- Claude Sonnet 4.5 / Haiku 4.5
- GPT 5.1 / GPT 5.1 Codex
- Gemini 3 Pro
- Kimi K2
- Qwen3 Coder

---

## 번역 정보

- **원본**: https://opencode.ai/docs/
- **번역일**: 2025년 12월 31일
- **번역 파일 수**: 34개

> 기술 용어(API, SDK, CLI, TUI, MCP, ACP, LSP 등)는 가독성을 위해 영어 그대로 유지했습니다.

---

## 관련 링크

- [OpenCode 공식 사이트](https://opencode.ai)
- [GitHub 저장소](https://github.com/sst/opencode)
- [Discord 커뮤니티](https://opencode.ai/discord)
- [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode)
- [opencode.cafe](https://opencode.cafe)
