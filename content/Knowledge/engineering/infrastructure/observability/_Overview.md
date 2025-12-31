# D3. Observability & Diagnostics

Created:: 2025-11-28
Tags:: #knowledge #observability #tracing #logging

---

## 학습 목표
- 분산된 TS + Rust + WASM 시스템에서 **"어디서 무슨 일이 일어나는지"** 추적 가능

---

## 세부 학습 항목

### 1. Logging vs Metrics vs Tracing 개념

### 2. Rust tracing crate 사용법

### 3. OpenTelemetry
- 트레이스 수집/전파
- 프론트엔드에서 Trace ID 생성 → 백엔드 전달

### 4. WASM panic 처리
- stack trace를 source map으로 복원 (개념)

---

## 실습 / 훈련

- [ ] HTTP 요청이 브라우저 → API → DB까지 이어지는 트레이스를 Jaeger/Grafana에서 시각화
- [ ] Rust 서버에 인위적 지연/오류 → 트레이스로 병목/에러 위치 찾기

---

## 관련 노트
- 
