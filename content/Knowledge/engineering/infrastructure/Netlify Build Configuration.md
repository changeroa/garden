# Netlify Build Configuration

Created: 2025-12-30 14:18
Modified: 2025-12-30 14:18
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #netlify #ci-cd #deployment #static-site
Up:: [[engineering/infrastructure/_Overview]]
Related::

---

> [!note]- Original Content
> 
> ---
> date created: 2025-12-26 19:56
> date modified: 2025-12-26 19:58
> ---
> ## Summary
> Netlify의 빌드 설정을 통해 프로젝트를 배포하기 위한 명령어와 배포 폴더를 정의합니다.
> 
> ## Key Points
> - **command**: Netlify 서버에서 실행할 빌드 명령어.
> - **publish**: 빌드 결과물이 위치하는 폴더.
> - **build.js**: 빌드 프로세스 중 생성되는 파일.
> 
> ## Details
> - command: "node build.js"
> 	- Netlify 서버에서 배포 전 실행되어 `dist/index.html`을 생성합니다.
> - publish: "dist"
> 	- 빌드 결과물이 있는 폴더 지정하는 환경변수, Netlify는 이 폴더의 파일만 서빙합니다.
> 
> ## Related
> - [[Netlify Build Settings]]
> - [[JavaScript Build Tools]]

---

Netlify Build Configuration은 netlify.toml 파일을 통해 빌드 명령어와 배포 폴더를 정의하는 설정이다.

---

## Core Idea
netlify.toml의 [build] 섹션에서 command와 publish 필드로 빌드 프로세스를 제어한다.
command는 배포 전 실행할 빌드 명령어를, publish는 결과물이 위치하는 폴더를 지정한다.
Netlify는 publish로 지정된 폴더의 파일만 정적 자산으로 서빙한다.

## Why It Matters
- 로컬과 동일한 빌드 프로세스를 CI/CD 환경에서 재현할 수 있다.
- 프로젝트별로 다른 빌드 설정을 버전 관리할 수 있다.
- 브랜치별로 다른 빌드 설정을 적용할 수 있다.

## Explanation
- command: `node build.js` - Netlify 서버에서 배포 전 실행되어 빌드 결과물 생성
- publish: `dist` - 빌드 결과물이 있는 폴더, Netlify는 이 폴더의 파일만 서빙
- netlify.toml 파일은 프로젝트 루트에 위치해야 함

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: netlify.toml에서 command와 publish 필드의 역할은?
- A: command는 배포 전 실행할 빌드 명령어, publish는 빌드 결과물이 위치하는 폴더로 Netlify가 서빙할 정적 자산의 위치를 지정
- Q: Netlify에서 dist 폴더 외의 파일은 어떻게 되는가?
- A: publish로 지정된 폴더(예: dist)의 파일만 서빙되고, 나머지 빌드 파일이나 소스 코드는 배포되지 않음
