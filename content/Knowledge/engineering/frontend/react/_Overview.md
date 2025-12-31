# A3. Frontend Application Architecture

Created:: 2025-11-28
Tags:: #knowledge #architecture #frontend

---

## 학습 목표
- 프론트엔드를 **도메인/애플리케이션/프레젠테이션 레이어**로 분리해서 설계
- 비즈니스 규칙이 UI 코드에 새지 않게 제어

---

## 세부 학습 항목

### 1. 계층화 & 폴더링
- Feature-Sliced Design
- Presentation / Application / Domain / Infrastructure 레이어

### 2. 도메인 모델링 (프론트 관점)
- Entity, Value Object
- Domain Service 개념

### 3. 상태머신 & Command 패턴
- "사용자 액션 → Command → State 변경" 구조
- Undo/Redo를 염두에 둔 상태 설계

### 4. 서버 상태와의 통합
- React Query 혹은 SWR 개념
- 캐시 키 설계 / 무효화 전략
- Optimistic Update / Rollback

---

## 실습 / 훈련

- [ ] "작업 관리" 앱: Domain Layer (Task, Project)를 분리해 설계
- [ ] Command 기반 구현: AddTask, UpdateTaskStatus
- [ ] Undo/Redo: History stack + Command 단위 되돌리기
- [ ] React Query로 낙관적 업데이트 + 실패 시 롤백 UX

---

## 관련 노트
- 
