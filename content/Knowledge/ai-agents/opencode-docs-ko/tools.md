# 도구

LLM이 사용할 수 있는 도구 관리.

도구를 사용하면 LLM이 코드베이스에서 작업을 수행할 수 있습니다. OpenCode에는 내장 도구 세트가 함께 제공되지만, [커스텀 도구](/docs/custom-tools) 또는 [MCP 서버](/docs/mcp-servers)로 확장할 수 있습니다.

기본적으로 모든 도구는 **활성화**되어 있으며 실행에 권한이 필요하지 않습니다. 하지만 설정을 통해 이를 구성하고 [권한](/docs/permissions)을 제어할 수 있습니다.

---

## 설정

도구를 전역적으로 또는 에이전트별로 구성할 수 있습니다. 에이전트별 설정은 전역 설정을 재정의합니다.

기본적으로 모든 도구는 `true`로 설정됩니다. 도구를 비활성화하려면 `false`로 설정합니다.

### 전역

`tools` 옵션을 사용하여 전역적으로 도구를 비활성화하거나 활성화합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": false,
    "bash": false,
    "webfetch": true
  }
}
```

와일드카드를 사용하여 여러 도구를 한 번에 제어할 수도 있습니다. 예를 들어, MCP 서버의 모든 도구를 비활성화하려면:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "mymcp_*": false
  }
}
```

### 에이전트별

에이전트 정의에서 `tools` 설정을 사용하여 특정 에이전트에 대한 전역 도구 설정을 재정의합니다.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": true,
    "bash": true
  },
  "agent": {
    "plan": {
      "tools": {
        "write": false,
        "bash": false
      }
    }
  }
}
```

---

## 내장

OpenCode에서 사용 가능한 모든 내장 도구입니다.

### bash

프로젝트 환경에서 셸 명령을 실행합니다. `npm install`, `git status` 또는 다른 셸 명령을 실행할 수 있습니다.

### edit

정확한 문자열 대체를 사용하여 기존 파일을 수정합니다. LLM이 코드를 수정하는 주요 방법입니다.

### write

새 파일을 만들거나 기존 파일을 덮어씁니다.

### read

코드베이스에서 파일 내용을 읽습니다. 대용량 파일에 대해 특정 줄 범위 읽기를 지원합니다.

### grep

정규 표현식을 사용하여 파일 내용을 검색합니다. 전체 정규식 구문 및 파일 패턴 필터링을 지원합니다.

### glob

패턴 매칭으로 파일을 찾습니다. `**/*.js` 또는 `src/**/*.ts`와 같은 glob 패턴을 사용하여 파일을 검색합니다.

### list

주어진 경로의 파일과 디렉토리를 나열합니다. glob 패턴을 사용하여 결과를 필터링할 수 있습니다.

### lsp (실험적)

구성된 LSP 서버와 상호 작용하여 정의, 참조, 호버 정보 및 호출 계층과 같은 코드 인텔리전스 기능을 가져옵니다.

> **Note**: 이 도구는 `OPENCODE_EXPERIMENTAL_LSP_TOOL=true`(또는 `OPENCODE_EXPERIMENTAL=true`)일 때만 사용 가능합니다.

### patch

파일에 패치를 적용합니다. 다양한 소스에서 diff와 패치를 적용하는 데 유용합니다.

### skill

[스킬](/docs/skills)(`SKILL.md` 파일)을 로드하고 대화에서 내용을 반환합니다.

### todowrite

코딩 세션 중에 할 일 목록을 관리합니다. 복잡한 작업 중에 진행 상황을 추적하기 위해 작업 목록을 만들고 업데이트합니다.

> **Note**: 이 도구는 기본적으로 서브 에이전트에서 비활성화되어 있지만 수동으로 활성화할 수 있습니다.

### todoread

기존 할 일 목록을 읽습니다. 어떤 작업이 보류 중이거나 완료되었는지 추적하는 데 사용됩니다.

### webfetch

웹 콘텐츠를 가져옵니다. 문서를 조회하거나 온라인 리소스를 연구하는 데 유용합니다.

---

## 커스텀 도구

커스텀 도구를 사용하면 LLM이 호출할 수 있는 자체 함수를 정의할 수 있습니다. 설정 파일에서 정의되며 임의의 코드를 실행할 수 있습니다.

[커스텀 도구 만들기에 대해 자세히 알아보기](/docs/custom-tools).

---

## MCP 서버

MCP(Model Context Protocol) 서버를 사용하면 외부 도구와 서비스를 통합할 수 있습니다. 여기에는 데이터베이스 액세스, API 통합 및 타사 서비스가 포함됩니다.

[MCP 서버 구성에 대해 자세히 알아보기](/docs/mcp-servers).

---

## 내부

내부적으로 `grep`, `glob`, `list`와 같은 도구는 [ripgrep](https://github.com/BurntSushi/ripgrep)을 사용합니다. 기본적으로 ripgrep은 `.gitignore` 패턴을 존중하므로 `.gitignore`에 나열된 파일과 디렉토리는 검색 및 목록에서 제외됩니다.

### 무시 패턴

일반적으로 무시되는 파일을 포함하려면 프로젝트 루트에 `.ignore` 파일을 만듭니다.

```
!node_modules/
!dist/
!build/
```

예를 들어, 이 `.ignore` 파일은 `.gitignore`에 나열되어 있더라도 ripgrep이 `node_modules/`, `dist/`, `build/` 디렉토리 내에서 검색할 수 있도록 합니다.
