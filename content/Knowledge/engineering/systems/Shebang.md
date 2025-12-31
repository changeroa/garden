# Shebang

Created: 2025-12-30 14:18
Modified: 2025-12-30 14:18
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #unix #linux #scripting #shell
Up:: [[engineering/systems/_Overview]]
Related::

---

> [!note]- Original Content
> 
> > [!ai]+ AI
> >
> > **2025-12-25_0217 -shebang**
> > **정의**: "shebang"은 스크립트 파일의 첫 줄에 위치하며, 해당 파일을 어떤 인터프리터(코드 해석기)로 실행할지를 지정하는 특별한 문자열입니다.
> > **쉽게 말하면**: 스크립트 파일의 첫 줄에 적혀 있는 문구로, 이 파일을 실행할 때 어떤 프로그램이 사용될지를 알려주는 역할을 합니다.
> > **예시**: 만약 Python 스크립트의 첫 줄에 `#!/usr/bin/env python3`라고 적혀 있다면, 이 스크립트는 Python 3로 실행되어야 한다는 의미입니다.
> > **주의**: "shebang"과 관련하여 흔히 잘못 이해하는 점은 단순히 주석(comment)으로 생각하는 것입니다. 하지만 shebang은 코드가 실행되는 방식을 실제로 결정하는 중요한 부분입니다.

---

Shebang은 스크립트 파일의 첫 줄에 위치하여 해당 파일을 실행할 인터프리터를 지정하는 특별한 문자열(#!)이다.

---

## Core Idea
Shebang은 `#!`로 시작하며, 그 뒤에 인터프리터의 경로를 지정한다 (예: `#!/usr/bin/env python3`).
운영체제가 스크립트를 직접 실행할 때 shebang을 읽어 적절한 인터프리터를 호출한다.
단순한 주석이 아니라 코드 실행 방식을 실제로 결정하는 중요한 메타데이터이다.

## Why It Matters
- 스크립트를 `./script.sh`처럼 직접 실행 가능하게 만든다.
- `/usr/bin/env`를 사용하면 시스템마다 다른 인터프리터 경로 문제를 해결할 수 있다.
- CLI 도구나 실행 파일 배포 시 필수적인 요소이다.

## Explanation
- 형식: `#!/path/to/interpreter` 또는 `#!/usr/bin/env interpreter`
- 예시: `#!/usr/bin/env python3` - PATH에서 python3를 찾아 실행
- 주의: 반드시 파일의 첫 번째 줄이어야 하며, 앞에 공백이나 다른 문자가 있으면 안 됨

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: Shebang이란 무엇이며 어디에 위치해야 하는가?
- A: 스크립트의 인터프리터를 지정하는 #!로 시작하는 문자열이며, 반드시 파일의 첫 번째 줄에 위치해야 한다.
- Q: #!/usr/bin/env python3와 #!/usr/bin/python3의 차이점은?
- A: env를 사용하면 PATH 환경변수에서 python3를 찾아 실행하므로 시스템마다 다른 설치 경로 문제를 해결할 수 있다.
