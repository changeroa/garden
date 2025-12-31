# 에이전트 스킬

SKILL.md 정의를 통해 재사용 가능한 동작 정의.

에이전트 스킬을 사용하면 OpenCode가 저장소 또는 홈 디렉토리에서 재사용 가능한 지침을 검색할 수 있습니다. 스킬은 기본 `skill` 도구를 통해 온디맨드로 로드됩니다. 에이전트는 사용 가능한 스킬을 보고 필요할 때 전체 콘텐츠를 로드할 수 있습니다.

---

## 파일 배치

스킬 이름당 하나의 폴더를 만들고 그 안에 `SKILL.md`를 넣습니다. OpenCode는 다음 위치를 검색합니다:

- 프로젝트 설정: `.opencode/skill/<name>/SKILL.md`
- 전역 설정: `~/.config/opencode/skill/<name>/SKILL.md`
- 프로젝트 Claude 호환: `.claude/skills/<name>/SKILL.md`
- 전역 Claude 호환: `~/.claude/skills/<name>/SKILL.md`

---

## 검색 이해

프로젝트 로컬 경로의 경우 OpenCode는 현재 작업 디렉토리에서 git 작업 트리에 도달할 때까지 위로 탐색합니다. 경로를 따라 `.opencode/`의 일치하는 `skill/*/SKILL.md`와 일치하는 `.claude/skills/*/SKILL.md`를 로드합니다.

전역 정의는 `~/.config/opencode/skill/*/SKILL.md` 및 `~/.claude/skills/*/SKILL.md`에서도 로드됩니다.

---

## 프론트매터 작성

각 `SKILL.md`는 YAML 프론트매터로 시작해야 합니다. 다음 필드만 인식됩니다:

- `name` (필수)
- `description` (필수)
- `license` (선택 사항)
- `compatibility` (선택 사항)
- `metadata` (선택 사항, 문자열-문자열 맵)

알 수 없는 프론트매터 필드는 무시됩니다.

---

## 이름 검증

`name`은:

- 1-64자여야 함
- 단일 하이픈 구분자가 있는 소문자 영숫자여야 함
- `-`로 시작하거나 끝나지 않아야 함
- 연속 `--`를 포함하지 않아야 함
- `SKILL.md`를 포함하는 디렉토리 이름과 일치해야 함

해당 정규식:

```
^[a-z0-9]+(-[a-z0-9]+)*$
```

---

## 길이 규칙 따르기

`description`은 1-1024자여야 합니다. 에이전트가 올바르게 선택할 수 있도록 충분히 구체적으로 유지하세요.

---

## 예시 사용

다음과 같이 `.opencode/skill/git-release/SKILL.md`를 만듭니다:

```markdown
---
name: git-release
description: 일관된 릴리스 및 변경 로그 생성
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## 내가 하는 일
- 병합된 PR에서 릴리스 노트 초안 작성
- 버전 범프 제안
- 복사-붙여넣기 가능한 `gh release create` 명령 제공

## 사용 시기
태그된 릴리스를 준비할 때 사용합니다.
대상 버전 관리 체계가 불분명하면 명확한 질문을 합니다.
```

---

## 권한 설정

`opencode.json`에서 패턴 기반 권한을 사용하여 에이전트가 액세스할 수 있는 스킬을 제어합니다:

```json
{
  "permission": {
    "skill": {
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask",
      "*": "allow"
    }
  }
}
```

| 권한 | 동작 |
|------|------|
| `allow` | 스킬이 즉시 로드됨 |
| `deny` | 스킬이 에이전트에서 숨겨지고 액세스가 거부됨 |
| `ask` | 로드 전에 사용자에게 승인 요청 |

패턴은 와일드카드를 지원합니다: `internal-*`는 `internal-docs`, `internal-tools` 등과 일치합니다.

---

## 에이전트별 재정의

특정 에이전트에게 전역 기본값과 다른 권한을 부여합니다.

**사용자 정의 에이전트의 경우** (에이전트 프론트매터에서):

```markdown
---
permission:
  skill:
    "documents-*": "allow"
---
```

**내장 에이전트의 경우** (`opencode.json`에서):

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

---

## 스킬 도구 비활성화

사용하지 않아야 하는 에이전트에 대해 스킬을 완전히 비활성화합니다:

**사용자 정의 에이전트의 경우**:

```markdown
---
tools:
  skill: false
---
```

**내장 에이전트의 경우**:

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

비활성화되면 `<available_skills>` 섹션이 완전히 생략됩니다.

---

## 로딩 문제 해결

스킬이 표시되지 않는 경우:

1. `SKILL.md`가 모두 대문자로 되어 있는지 확인
2. 프론트매터에 `name`과 `description`이 포함되어 있는지 확인
3. 스킬 이름이 모든 위치에서 고유한지 확인
4. 권한 확인—`deny`가 있는 스킬은 에이전트에서 숨겨짐
