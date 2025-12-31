# C3. Browser Multithreading & Off-main-thread Execution

Created:: 2025-11-28
Tags:: #knowledge #wasm #worker #multithreading

---

## 학습 목표
- Web Worker, SharedArrayBuffer, WASM 스레드를 이용해 **메인 스레드를 막지 않는 구조** 설계

---

## 세부 학습 항목

### 1. Web Worker / Dedicated Worker

### 2. SharedArrayBuffer, Atomics

### 3. WASM multi-threading
- 브라우저 지원 환경 가정

### 4. OffscreenCanvas 개념
- 렌더링 오프로드

---

## 실습 / 훈련

- [ ] Worker에서 데이터 처리, 메인 스레드는 UI만 담당
- [ ] SharedArrayBuffer로 워커 ↔ 메인 간 복사 없이 데이터 공유
- [ ] Worker 연산 → 결과만 메인으로 전달해 캔버스 갱신

---

## 관련 노트
- 
