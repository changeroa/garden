```C 
# Safety Algorithm for Banker's Algorithm

# 1. 초기화 (Initialize)
# Work: 현재 가용 자원 시뮬레이션용 벡터 (m: 자원 종류 수)
# Finish: 프로세스 완료 여부 체크용 벡터 (n: 프로세스 수)
Work = Available.copy()
Finish = [False] * n 

# 2. 프로세스 탐색 및 실행 시뮬레이션 (Loop)
while True:
    # 아래 두 조건을 만족하는 인덱스 i를 찾음
    # (a) 아직 끝나지 않은 프로세스 (Finish[i] == False)
    # (b) 필요한 자원이 현재 가용 자원보다 작거나 같음 (Need[i] <= Work)
    found_process = False
    
    for i in range(n):
        if not Finish[i] and Need[i] <= Work:
            # 3. 가상 실행 (Simulate Execution)
            # 프로세스 i가 자원을 할당받아 작업을 마치고, 
            # 가지고 있던 자원(Allocation)을 반납했다고 가정함
            Work = Work + Allocation[i]
            Finish[i] = True
            found_process = True
            
            # 자원이 늘어났으므로, 처음부터 다시 탐색 (Greedy)
            break 
    
    # 더 이상 실행 가능한 프로세스가 없으면 루프 종료
    if not found_process:
        break

# 4. 결론 (Conclusion)
if all(Finish):
    print("System is in a Safe State")
else:
    print("System is in an Unsafe State (Deadlock Risk)")
```