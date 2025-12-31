# 규칙

opencode에 대한 사용자 정의 지침 설정.

`AGENTS.md` 파일을 만들어 opencode에 사용자 정의 지침을 제공할 수 있습니다. 이것은 `CLAUDE.md` 또는 Cursor의 규칙과 유사합니다. 특정 프로젝트에 맞게 동작을 사용자 정의하기 위해 LLM의 컨텍스트에 포함될 지침이 포함되어 있습니다.

---

## 초기화

새 `AGENTS.md` 파일을 만들려면 opencode에서 `/init` 명령을 실행할 수 있습니다.

> **Tip**: 프로젝트의 `AGENTS.md` 파일을 Git에 커밋해야 합니다.

이렇게 하면 프로젝트와 모든 내용을 스캔하여 프로젝트가 무엇인지 이해하고 `AGENTS.md` 파일을 생성합니다. 이는 opencode가 프로젝트를 더 잘 탐색하는 데 도움이 됩니다.

기존 `AGENTS.md` 파일이 있는 경우 여기에 추가하려고 합니다.

---

## 예제

이 파일을 수동으로 만들 수도 있습니다. `AGENTS.md` 파일에 넣을 수 있는 몇 가지 예시입니다.

```markdown
# SST v3 모노레포 프로젝트

이것은 TypeScript가 있는 SST v3 모노레포입니다. 프로젝트는 패키지 관리에 bun 워크스페이스를 사용합니다.

## 프로젝트 구조

- `packages/` - 모든 워크스페이스 패키지 포함 (functions, core, web 등)
- `infra/` - 서비스별로 분할된 인프라 정의 (storage.ts, api.ts, web.ts)
- `sst.config.ts` - 동적 import가 있는 기본 SST 설정

## 코드 표준

- strict 모드가 활성화된 TypeScript 사용
- 공유 코드는 적절한 exports 설정과 함께 `packages/core/`에 배치
- 함수는 `packages/functions/`에 배치
- 인프라는 `infra/`의 논리적 파일로 분할되어야 함

## 모노레포 규칙

- 워크스페이스 이름을 사용하여 공유 모듈 가져오기: `@my-app/core/example`
```

여기에 프로젝트별 지침을 추가하고 있으며 이것은 팀 전체에서 공유됩니다.

---

## 유형

opencode는 여러 위치에서 `AGENTS.md` 파일을 읽는 것도 지원합니다. 이는 다른 목적을 가집니다.

### 프로젝트

위에서 본 것처럼 `AGENTS.md`가 프로젝트 루트에 배치된 것은 프로젝트별 규칙입니다. 이 디렉토리 또는 하위 디렉토리에서 작업할 때만 적용됩니다.

### 전역

`~/.config/opencode/AGENTS.md` 파일에 전역 규칙을 가질 수도 있습니다. 이는 모든 opencode 세션에 적용됩니다.

Git에 커밋되거나 팀과 공유되지 않으므로 LLM이 따라야 할 개인 규칙을 지정하는 데 사용하는 것이 좋습니다.

---

## 우선순위

opencode가 시작되면 다음을 찾습니다:

1. 현재 디렉토리에서 위로 탐색하여 **로컬 파일**
2. `~/.config/opencode/AGENTS.md`를 확인하여 **전역 파일**

전역 및 프로젝트별 규칙이 모두 있는 경우 opencode는 이를 함께 결합합니다.

---

## 사용자 정의 지침

`opencode.json` 또는 전역 `~/.config/opencode/opencode.json`에서 사용자 정의 지침 파일을 지정할 수 있습니다. 이를 통해 AGENTS.md에 복제할 필요 없이 기존 규칙을 재사용할 수 있습니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]
}
```

모든 지침 파일은 `AGENTS.md` 파일과 결합됩니다.

---

## 외부 파일 참조

opencode는 `AGENTS.md`에서 파일 참조를 자동으로 파싱하지 않지만, 두 가지 방법으로 유사한 기능을 달성할 수 있습니다:

### opencode.json 사용

권장 접근 방식은 `opencode.json`의 `instructions` 필드를 사용하는 것입니다:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["docs/development-standards.md", "test/testing-guidelines.md", "packages/*/AGENTS.md"]
}
```

### AGENTS.md에서 수동 지침

`AGENTS.md`에 명시적인 지침을 제공하여 opencode가 외부 파일을 읽도록 가르칠 수 있습니다:

```markdown
# TypeScript 프로젝트 규칙

## 외부 파일 로딩

중요: 파일 참조(예: @rules/general.md)를 만나면 필요에 따라 Read 도구를 사용하여 로드하세요. 당면한 특정 작업과 관련이 있습니다.

지침:
- 모든 참조를 미리 로드하지 마세요 - 실제 필요에 따라 지연 로딩 사용
- 로드되면 기본값을 재정의하는 필수 지침으로 취급
- 필요할 때 참조를 재귀적으로 따르세요

## 개발 가이드라인

TypeScript 코드 스타일 및 모범 사례: @docs/typescript-guidelines.md
React 컴포넌트 아키텍처 및 훅 패턴: @docs/react-patterns.md
```

> **Tip**: 공유 표준이 있는 모노레포 또는 프로젝트의 경우 glob 패턴(예: `packages/*/AGENTS.md`)과 함께 `opencode.json`을 사용하는 것이 수동 지침보다 유지 관리가 더 쉽습니다.
