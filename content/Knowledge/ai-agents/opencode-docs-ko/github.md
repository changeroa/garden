# GitHub

GitHub 이슈 및 풀 리퀘스트에서 OpenCode 사용.

OpenCode는 GitHub 워크플로와 통합됩니다. 댓글에서 `/opencode` 또는 `/oc`를 멘션하면 OpenCode가 GitHub Actions 러너 내에서 작업을 실행합니다.

---

## 기능

- **이슈 분류**: OpenCode에 이슈를 살펴보고 설명해달라고 요청합니다.
- **수정 및 구현**: OpenCode에 이슈를 수정하거나 기능을 구현해달라고 요청합니다. 새 브랜치에서 작업하고 모든 변경 사항이 포함된 PR을 제출합니다.
- **보안**: OpenCode는 GitHub 러너 내에서 실행됩니다.

---

## 설치

GitHub 저장소에 있는 프로젝트에서 다음 명령을 실행합니다:

```bash
opencode github install
```

이렇게 하면 GitHub 앱 설치, 워크플로 생성 및 시크릿 설정을 안내합니다.

### 수동 설정

또는 수동으로 설정할 수 있습니다.

1. **GitHub 앱 설치**

   [**github.com/apps/opencode-agent**](https://github.com/apps/opencode-agent)로 이동합니다. 대상 저장소에 설치되어 있는지 확인합니다.

2. **워크플로 추가**

   저장소의 `.github/workflows/opencode.yml`에 다음 워크플로 파일을 추가합니다. `env`에서 적절한 `model`과 필요한 API 키를 설정해야 합니다.

```yaml
name: opencode

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  opencode:
    if: |
      contains(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run OpenCode
        uses: sst/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
```

3. **시크릿에 API 키 저장**

   조직 또는 프로젝트 **설정**에서 왼쪽의 **Secrets and variables**를 확장하고 **Actions**를 선택합니다. 필요한 API 키를 추가합니다.

---

## 설정

- `model`: OpenCode와 함께 사용할 모델. `provider/model` 형식. **필수**.
- `agent`: 사용할 에이전트. 기본 에이전트여야 함. 찾지 못하면 설정의 `default_agent` 또는 `"build"`로 대체.
- `share`: OpenCode 세션 공유 여부. 공개 저장소의 경우 기본값 **true**.
- `prompt`: 기본 동작을 재정의하는 선택적 사용자 정의 프롬프트.
- `token`: 댓글 작성, 변경 사항 커밋, 풀 리퀘스트 열기와 같은 작업을 수행하기 위한 선택적 GitHub 액세스 토큰.

---

## 지원되는 이벤트

| 이벤트 유형 | 트리거 | 세부 정보 |
|------------|--------|----------|
| `issue_comment` | 이슈 또는 PR의 댓글 | 댓글에서 `/opencode` 또는 `/oc` 멘션 |
| `pull_request_review_comment` | PR의 특정 코드 줄에 대한 댓글 | 코드 검토 중 `/opencode` 또는 `/oc` 멘션 |
| `issues` | 이슈 열림 또는 편집됨 | 이슈 생성 또는 수정 시 자동 트리거 |
| `pull_request` | PR 열림 또는 업데이트됨 | PR 열림, 동기화 또는 다시 열림 시 자동 트리거 |
| `schedule` | 크론 기반 일정 | 일정에 따라 OpenCode 실행 |
| `workflow_dispatch` | GitHub UI에서 수동 트리거 | Actions 탭을 통해 요청 시 OpenCode 트리거 |

---

## 사용자 정의 프롬프트

워크플로에 맞게 OpenCode의 동작을 사용자 정의하기 위해 기본 프롬프트를 재정의합니다.

```yaml
- uses: sst/opencode/github@latest
  with:
    model: anthropic/claude-sonnet-4-5
    prompt: |
      이 풀 리퀘스트를 검토하세요:
      - 코드 품질 문제 확인
      - 잠재적인 버그 찾기
      - 개선 사항 제안
```

---

## 예시

GitHub에서 OpenCode를 사용하는 방법에 대한 몇 가지 예시입니다.

- **이슈 설명**

  GitHub 이슈에 이 댓글을 추가합니다.

  ```
  /opencode 이 이슈를 설명해주세요
  ```

  OpenCode는 모든 댓글을 포함한 전체 스레드를 읽고 명확한 설명으로 답변합니다.

- **이슈 수정**

  GitHub 이슈에서:

  ```
  /opencode 이것을 수정해주세요
  ```

  OpenCode는 새 브랜치를 만들고, 변경 사항을 구현하고, 변경 사항이 포함된 PR을 엽니다.

- **PR 검토 및 변경**

  GitHub PR에 다음 댓글을 남깁니다.

  ```
  노트가 제거될 때 S3에서 첨부 파일을 삭제하세요 /oc
  ```

  OpenCode는 요청된 변경 사항을 구현하고 동일한 PR에 커밋합니다.
