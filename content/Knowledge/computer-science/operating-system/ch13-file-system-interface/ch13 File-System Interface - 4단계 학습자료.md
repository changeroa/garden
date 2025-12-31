# Chapter 13: File-System Interface - 4단계 학습 자료

---

## 1단계: 초등학생도 이해하는 [핵심 컨셉]

**파일 시스템은 컴퓨터의 "서류 캐비닛"과 같습니다.**

도서관을 생각해보세요. 책(파일)들이 서가(디렉토리)에 정리되어 있고, 각 책에는 제목과 저자 정보(속성)가 붙어 있습니다. 사서(운영체제)가 책을 찾고, 빌려주고, 반납받는 규칙(접근 방법)을 관리합니다. 그리고 어떤 책은 회원만 볼 수 있고, 어떤 책은 누구나 볼 수 있는 것처럼 접근 권한(보호)도 정해져 있습니다.

---

## 2단계: 흐름 파악을 위한 [논리 구조화]

### A. 파일의 기본 개념
- **파일이란?** 연속된 논리적 주소 공간(Contiguous logical address space)
- **파일 타입**: 데이터(숫자, 문자, 바이너리) 또는 프로그램
- **파일 속성 7가지**:
  - Name (이름) - 유일하게 사람이 읽을 수 있는 정보
  - Identifier (식별자) - 파일 시스템 내 고유 번호
  - Type (유형)
  - Location (위치) - 장치 내 파일 위치 포인터
  - Size (크기)
  - Protection (보호) - 읽기/쓰기/실행 권한
  - Time, date, user identification (시간, 날짜, 사용자 정보)

### B. 파일 연산 (Operations)
- **기본 연산**: Create, Write, Read, Reposition(seek), Delete, Truncate
- **Open**: 디스크의 디렉토리에서 파일을 찾아 메모리로 로드
- **Close**: 메모리의 파일 정보를 디스크에 저장
- **열린 파일 관리 정보**:
  - Open-file table (열린 파일 테이블)
  - File pointer (파일 포인터)
  - File-open count (파일 열림 횟수)
  - Disk location (디스크 위치)
  - Access rights (접근 권한)

### C. 파일 잠금 (File Locking)
- **Shared lock**: 여러 프로세스가 동시에 획득 가능 (읽기용)
- **Exclusive lock**: 한 프로세스만 획득 가능 (쓰기용)
- **Mandatory vs Advisory**: 강제적 잠금 vs 권고적 잠금

### D. 접근 방법 (Access Methods)
- **순차 접근 (Sequential Access)**: read next, write next, reset
- **직접 접근 (Direct Access)**: 고정 길이 논리 레코드로 구성, 상대 블록 번호(n)로 접근

### E. 디렉토리 구조
- **목적**: 효율성(Efficiency), 명명(Naming), 그룹화(Grouping)
- **트리 구조 디렉토리**: 효율적 검색, 그룹화 가능, 절대/상대 경로명 사용
- **비순환 그래프 디렉토리**: 파일/디렉토리 공유 가능, Link를 통해 구현

### F. 파일 시스템 마운팅
- 파일 시스템은 접근 전에 반드시 **마운트(mount)** 되어야 함
- 마운트되지 않은 파일 시스템은 **마운트 포인트(mount point)**에 연결됨

### G. 파일 공유 및 보호
- **User ID / Group ID**로 사용자 식별 및 권한 관리
- **NFS (Network File System)**: 네트워크를 통한 파일 공유
- **접근 유형**: Read, Write, Execute, Append, Delete, List
- **Unix/Linux 권한**: owner(소유자), group(그룹), public(기타) 각각 RWX

---

## 3단계: 원문 정복을 위한 [심층 해설 및 용어]

### 핵심 용어 풀이

| 용어 | 설명 |
|------|------|
| **Contiguous logical address space** | 파일이 메모리에서 연속된 주소로 표현된다는 의미. 실제 디스크에서는 분산 저장될 수 있지만, 논리적으로는 연속됨 |
| **Open-file table** | 현재 열려있는 파일들의 정보를 추적하는 시스템 테이블. 파일 포인터, 열림 횟수 등을 관리 |
| **File-open count** | 파일이 몇 번 열렸는지 세는 카운터. 마지막 프로세스가 닫을 때 테이블에서 제거됨 |
| **Mandatory lock vs Advisory lock** | Mandatory는 OS가 강제로 잠금을 적용, Advisory는 프로세스가 잠금 상태를 확인하고 자율적으로 판단 |
| **Volume** | 파일 시스템을 담고 있는 엔티티. 파티션이나 디스크 전체가 될 수 있음 |

### 시험 출제 포인트

1. **파일 속성 중 Name만이 사람이 읽을 수 있는 형태** - Identifier는 숫자(번호)

2. **Open-file table의 File-open count 역할**: 여러 프로세스가 같은 파일을 열 때, 마지막 프로세스가 닫을 때만 테이블에서 제거

3. **Direct Access에서 n의 의미**: relative block number (상대 블록 번호)

4. **chmod 761의 의미**:
   - 7 (owner) = 111 = rwx (읽기+쓰기+실행)
   - 6 (group) = 110 = rw- (읽기+쓰기)
   - 1 (public) = 001 = --x (실행만)

5. **트리 구조 디렉토리 삭제 시**: 해당 디렉토리와 **하위 전체 서브트리가 삭제**됨

6. **Acyclic-Graph Directory의 Link**: 기존 파일에 대한 또 다른 이름(포인터)

---

## 4단계: 최종 점검 [빈칸 뚫기 테스트]

### 빈칸 채우기 문제

1. 파일은 ( ① )한 논리적 주소 공간이다.

2. 파일 속성 중 사람이 읽을 수 있는 형태로 유지되는 유일한 정보는 ( ② )이다.

3. 열린 파일을 관리하기 위해 ( ③ )가 사용되며, 파일이 몇 번 열렸는지 추적하는 ( ④ )가 포함된다.

4. 파일 잠금에서 여러 프로세스가 동시에 획득할 수 있는 것은 ( ⑤ )이고, 한 프로세스만 획득할 수 있는 것은 ( ⑥ )이다.

5. 직접 접근(Direct Access)에서 파일은 고정 길이 ( ⑦ )로 구성되며, n은 ( ⑧ )를 의미한다.

6. 파일 시스템은 접근하기 전에 반드시 ( ⑨ )되어야 하며, ( ⑩ )에 연결된다.

7. Unix/Linux에서 chmod 761의 owner 권한은 ( ⑪ )이고, 이진수로는 ( ⑫ )이다.

8. 비순환 그래프 디렉토리에서 기존 파일에 대한 또 다른 이름(포인터)을 ( ⑬ )라고 한다.

9. 네트워크를 통한 분산 파일 공유 방법으로 ( ⑭ )가 일반적으로 사용된다.

10. 트리 구조 디렉토리에서 상위 디렉토리를 삭제하면 ( ⑮ )가 함께 삭제된다.

---

### 정답

| 번호 | 정답 |
|:---:|------|
| ① | Contiguous (연속적인) |
| ② | Name (이름) |
| ③ | Open-file table |
| ④ | File-open count |
| ⑤ | Shared lock |
| ⑥ | Exclusive lock |
| ⑦ | logical records (논리 레코드) |
| ⑧ | relative block number (상대 블록 번호) |
| ⑨ | mount (마운트) |
| ⑩ | mount point (마운트 포인트) |
| ⑪ | 7 (rwx - 읽기, 쓰기, 실행 모두 가능) |
| ⑫ | 111 |
| ⑬ | Link (링크) |
| ⑭ | NFS (Network File System) |
| ⑮ | entire subtree (전체 서브트리) |
