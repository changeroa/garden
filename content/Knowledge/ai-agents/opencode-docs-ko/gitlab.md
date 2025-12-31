# GitLab

GitLab 이슈 및 머지 리퀘스트에서 OpenCode 사용.

OpenCode는 GitLab CI/CD 파이프라인 또는 GitLab Duo를 통해 GitLab 워크플로와 통합됩니다.

두 경우 모두 OpenCode는 GitLab 러너에서 실행됩니다.

---

## GitLab CI

OpenCode는 일반 GitLab 파이프라인에서 작동합니다. [CI 컴포넌트](https://docs.gitlab.com/ee/ci/components/)로 파이프라인에 빌드할 수 있습니다.

여기서는 OpenCode용 커뮤니티 생성 CI/CD 컴포넌트인 [nagyv/gitlab-opencode](https://gitlab.com/nagyv/gitlab-opencode)를 사용합니다.

### 기능

- **작업당 사용자 정의 설정 사용**: 사용자 정의 설정 디렉토리(예: `./config/#custom-directory`)로 OpenCode를 구성하여 OpenCode 호출당 기능을 활성화하거나 비활성화합니다.
- **최소 설정**: CI 컴포넌트가 백그라운드에서 OpenCode를 설정하므로 OpenCode 설정과 초기 프롬프트만 만들면 됩니다.
- **유연성**: CI 컴포넌트는 동작을 사용자 정의하기 위한 여러 입력을 지원합니다.

### 설정

1. OpenCode 인증 JSON을 **Settings** > **CI/CD** > **Variables**에서 File 타입 CI 환경 변수로 저장합니다. "Masked and hidden"으로 표시해야 합니다.

2. `.gitlab-ci.yml` 파일에 다음을 추가합니다.

```yaml
include:
  - component: $CI_SERVER_FQDN/nagyv/gitlab-opencode/opencode@2
    inputs:
      config_dir: ${CI_PROJECT_DIR}/opencode-config
      auth_json: $OPENCODE_AUTH_JSON # OpenCode 인증 JSON의 변수 이름
      command: optional-custom-command
      message: "Your prompt here"
```

더 많은 입력 및 사용 사례는 이 컴포넌트의 [문서를 확인하세요](https://gitlab.com/explore/catalog/nagyv/gitlab-opencode).

---

## GitLab Duo

OpenCode는 GitLab 워크플로와 통합됩니다. 댓글에서 `@opencode`를 멘션하면 OpenCode가 GitLab CI 파이프라인 내에서 작업을 실행합니다.

### 기능

- **이슈 분류**: OpenCode에 이슈를 살펴보고 설명해달라고 요청합니다.
- **수정 및 구현**: OpenCode에 이슈를 수정하거나 기능을 구현해달라고 요청합니다. 새 브랜치를 만들고 변경 사항이 포함된 머지 리퀘스트를 제출합니다.
- **보안**: OpenCode는 GitLab 러너에서 실행됩니다.

### 설정

OpenCode는 GitLab CI/CD 파이프라인에서 실행됩니다. 설정에 필요한 사항:

> **Tip**: 최신 지침은 [**GitLab 문서**](https://docs.gitlab.com/user/duo_agent_platform/agent_assistant/)를 확인하세요.

1. GitLab 환경 구성
2. CI/CD 설정
3. AI 모델 제공자 API 키 얻기
4. 서비스 계정 생성
5. CI/CD 변수 구성
6. 플로우 설정 파일 생성

[GitLab CLI 에이전트 문서](https://docs.gitlab.com/user/duo_agent_platform/agent_assistant/)에서 자세한 지침을 참조할 수 있습니다.

### 예시

GitLab에서 OpenCode를 사용하는 방법에 대한 몇 가지 예시입니다.

> **Tip**: `@opencode` 이외의 다른 트리거 문구를 사용하도록 구성할 수 있습니다.

- **이슈 설명**

  GitLab 이슈에 이 댓글을 추가합니다.

  ```
  @opencode 이 이슈를 설명해주세요
  ```

  OpenCode는 이슈를 읽고 명확한 설명으로 답변합니다.

- **이슈 수정**

  GitLab 이슈에서:

  ```
  @opencode 이것을 수정해주세요
  ```

  OpenCode는 새 브랜치를 만들고, 변경 사항을 구현하고, 변경 사항이 포함된 머지 리퀘스트를 엽니다.

- **머지 리퀘스트 검토**

  GitLab 머지 리퀘스트에 다음 댓글을 남깁니다.

  ```
  @opencode 이 머지 리퀘스트를 검토해주세요
  ```

  OpenCode는 머지 리퀘스트를 검토하고 피드백을 제공합니다.
