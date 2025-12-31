```C
# Resource-Request Algorithm for Process P_i

def request_resources(i, request_vector):
    """
    i: 요청하는 프로세스 번호 (P_i)
    request_vector: 요청할 자원 개수 리스트 (Request_i)
    """

    # 1. 유효성 검사 (Validity Check)
    # 요청량이 프로세스가 처음에 신고한 최대치보다 남은 필요량을 초과하는지 확인
    if request_vector > Need[i]:
        raise Error("Process has exceeded its maximum claim.") 

    # 2. 가용성 검사 (Availability Check)
    # 당장 금고에 있는 돈(Available)으로 줄 수 있는지 확인
    if request_vector > Available:
        print(f"Process {i} must wait. (Resources are not available)")
        return "Wait"

    # 3. 가상 할당 (Pretend to Allocate)
    # 상태를 변경하기 전에, 만약을 대비해 현재 상태를 백업(선택적 구현)하거나
    # 나중에 롤백할 준비를 함.
    
    # --- 상태 변경 시작 ---
    Available     = Available - request_vector
    Allocation[i] = Allocation[i] + request_vector
    Need[i]       = Need[i] - request_vector
    # -------------------

    # 4. 안전성 검사 (Safety Check)
    # 변경된 상태에서 Safety Algorithm을 돌려봄
    if is_safe_state():
        # 안전함(Safe) -> 이 상태를 확정(Commit)
        print(f"Resources allocated to Process {i}.")
        return "Granted"
        
    else:
        # 위험함(Unsafe) -> 롤백(Rollback) 및 대기
        # 변경했던 상태를 원상 복구함 (Restore old state)
        Available     = Available + request_vector
        Allocation[i] = Allocation[i] - request_vector
        Need[i]       = Need[i] + request_vector
        
        print(f"Process {i} must wait. (Granting request leads to Unsafe State)")
        return "Wait"
```