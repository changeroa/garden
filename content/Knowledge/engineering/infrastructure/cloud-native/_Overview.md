# D2. Cloud Native Deployment

Created:: 2025-11-28
Tags:: #knowledge #docker #cicd #deployment

---

## 학습 목표
- TS + Rust + WASM 프로젝트를 컨테이너 기반으로 배포하는 파이프라인 설계

---

## 세부 학습 항목

### 1. Docker multi-stage 빌드
- Rust 빌드 환경 vs 런타임 이미지
- Node 빌드(프론트) + 정적 파일 서빙

### 2. Rust 빌드 최적화
- mold linker, sccache

### 3. CI/CD
- GitHub Actions로 테스트 → 빌드 → 배포 파이프라인

---

## 실습 / 훈련

- [ ] Fullstack 서비스: Docker 이미지 하나로 API + 정적 파일 제공
- [ ] CI 구성: push시 테스트, 태그시 도커 이미지 빌드/푸시

---

## 관련 노트
- 
