# 1.0으로 마이그레이션

OpenCode 1.0의 새로운 기능.

OpenCode 1.0은 TUI의 완전한 재작성입니다.

성능 및 기능 문제가 있던 go+bubbletea 기반 TUI에서 zig+solidjs로 작성된 사내 프레임워크(OpenTUI)로 이동했습니다.

새 TUI는 동일한 opencode 서버에 연결되므로 이전과 동일하게 작동합니다.

---

## 업그레이드

현재 이전 버전을 사용 중인 경우 1.0으로 자동 업그레이드되지 않습니다. 그러나 일부 이전 버전의 OpenCode는 항상 최신 버전을 가져옵니다.

수동으로 업그레이드하려면 다음을 실행합니다:

```bash
$ opencode upgrade 1.0.0
```

0.x로 다시 다운그레이드하려면 다음을 실행합니다:

```bash
$ opencode upgrade 0.15.31
```

---

## UX 변경 사항

세션 기록이 더 압축되어 edit 및 bash 도구의 전체 세부 정보만 표시됩니다.

거의 모든 것이 통과하는 명령 모음을 추가했습니다. 어떤 컨텍스트에서든 ctrl+p를 눌러 할 수 있는 모든 것을 확인하세요.

유용한 정보가 있는 세션 사이드바를 추가했습니다(토글 가능).

실제로 사용하는 사람이 있는지 확실하지 않은 일부 기능을 제거했습니다. 중요한 것이 누락된 경우 이슈를 열어주시면 빠르게 다시 추가하겠습니다.

---

## 주요 변경 사항

### 키바인드 이름 변경

- messages\_revert -> messages\_undo
- switch\_agent -> agent\_cycle
- switch\_agent\_reverse -> agent\_cycle\_reverse
- switch\_mode -> agent\_cycle
- switch\_mode\_reverse -> agent\_cycle\_reverse

### 키바인드 제거

- messages\_layout\_toggle
- messages\_next
- messages\_previous
- file\_diff\_toggle
- file\_search
- file\_close
- file\_list
- app\_help
- project\_init
- tool\_details
- thinking\_blocks
