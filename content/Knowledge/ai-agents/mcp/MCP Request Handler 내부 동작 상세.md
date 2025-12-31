# MCP Request Handler 내부 동작 상세

Created: 2025-12-30 14:18
Modified: 2025-12-30 14:18
TemplateVersion: v1
Status: #status/seedling
Tags: #knowledge #mcp #typescript #type-casting #request-handler
Up:: [[ai-agents/mcp/_Overview]]
Related::

---

> [!note]- Original Content
> 
> 제공해주신 내용은 **MCP(Model Context Protocol) 서버가 클라이언트(Claude 등)의 요청을 어떻게 받아서 처리하는지**에 대한 핵심 로직입니다.
> 
> 특히 **"왜 입력값(`args`)의 모양(Type)이 제각각인지"**와 **"왜 `as unknown as`라는 복잡한 문법을 쓰는지"**가 가장 궁금하신 부분일 텐데요, 이 부분을 중심으로 친절하게 풀어서 설명해 드리겠습니다.
> 
> ---
>
> ### 1. 전체적인 상황: "서버는 거대한 분배기"
> 
> 이 코드는 **요청 처리기(Request Handler)**입니다. 마치 호텔 프론트 데스크처럼, 들어오는 요청의 종류를 보고 적절한 담당자(함수)에게 연결해 주는 역할을 합니다.
> 
> - **도구 목록 요청 (`ListToolsRequestSchema`)**: "너 무슨 기능 있어?"라고 물으면 메뉴판(`tools`)을 보여줍니다.
>     
> - **도구 실행 요청 (`CallToolRequestSchema`)**: "이 기능 실행해줘!"라고 하면 실제로 일을 시킵니다.
>     
> 
> ### 2. 핵심 질문 1: "왜 `args` 타입이 다 다른가요?"
> 
> 코드에서 `args`는 클라이언트가 도구를 실행할 때 함께 보낸 **재료(입력값)**입니다. 도구마다 하는 일이 다르니, 필요한 재료도 당연히 다릅니다.
> 
> 쉽게 비유하자면 **'관공서의 신청서'**와 같습니다.
> 
> - **`list_categories` (목록 조회)**:
>     
>     - 그냥 목록만 보여주면 되니, 작성할 신청서 내용이 없습니다.
>         
>     - 그래서 **빈 종이**(`Record<string, unknown>`)나 다름없는 상태로 넘어갑니다.
>         
> - **`get_moc` (MOC 가져오기)**:
>     
>     - 어떤 MOC를 가져올지 알아야 하니, **"카테고리 이름"**이 꼭 적혀 있어야 합니다.
>         
> - **`create_inbox_note` (메모 작성)**:
>     
>     - 새 글을 써야 하니, **"제목"**과 **"본문"**이 적힌 신청서가 필요합니다.
>         
> 
> **결론:** MCP SDK 입장에서는 "일단 뭐가 들어있든 `args`라는 박스에 담아줄게"라고 하지만, **우리는 그 박스를 열어서 내용물에 맞게 분류**해야 하기 때문에 각기 다른 타입(`GetMocInput`, `InboxNoteInput` 등)을 사용하는 것입니다.
> 
> ### 3. 핵심 질문 2: "왜 `as unknown as`를 두 번이나 쓰나요?"
> 
> TypeScript
> 
> ```
> args as unknown as GetMocInput
> ```
> 
> 이 부분은 **TypeScript(타입스크립트)라는 경비원을 안심시키는 과정**입니다.
> 
> 1. **TypeScript의 고집:** TypeScript는 매우 깐깐합니다. `args`는 처음에 "무슨 모양인지 모르는 객체(`Record`)"라고 정의되어 있습니다. 그런데 개발자가 갑자기 "이거 사실 `InboxNoteInput`이야!"라고 우기면, TypeScript는 **"모양이 다른데? 실수한 거 아냐?"**라며 에러(빨간 줄)를 띄웁니다.
>     
> 2. **`as unknown` (세탁):** 그래서 일단 `args`를 `unknown`(알 수 없음)으로 바꿉니다. 이는 TypeScript에게 **"잠깐, 이거 일단 뭔지 모르는 거라고 치자(Type 지우기)"**라고 말하는 것과 같습니다.
>     
> 3. **`as GetMocInput` (재정의):** 이제 백지상태가 되었으니, **"이제 보니까 이거 `GetMocInput`이네!"**라고 확정 짓습니다.
>     
> 
> **요약:** 직접 변환(`A` → `B`)이 안 되니, 중간 단계(`A` → `Unknown` → `B`)를 거쳐서 TypeScript의 경고를 우회하는 **안전한 편법**입니다.
> 
> ### 4. 전체 흐름 요약 (다이어그램 해설)
> 
> 제공해주신 그림 설명이 아주 정확합니다. 실제 동작은 이렇게 이루어집니다.
> 
> 1. **배송 (MCP SDK):** Claude가 "지식 노트 만들어줘(제목: VM, 카테고리: CS)"라고 요청을 보냅니다. 이때 도착한 택배 상자(`args`) 겉면에는 내용물 정보가 안 적혀 있습니다.
>     
> 2. **분류 (Switch 문):** 서버가 택배 송장(`name`)을 봅니다. "`create_knowledge_note`구나!"
>     
> 3. **개봉 및 확인 (Type Casting):** "그럼 이 상자 안에는 제목과 카테고리가 들어있겠군."이라고 확신하며 상자를 엽니다. (`as unknown as CreateKnowledgeNoteInput`)
>     
> 4. **작업 수행 (Function Call):** 내용물을 꺼내서 실제 노트를 만드는 전문가(`handleCreateKnowledgeNote`)에게 전달합니다.
>     
> 
> ### 5. 이 코드의 장점
> 
> - **안전성:** `try-catch`로 감싸져 있어, 도구 실행 중 에러가 나도 서버가 멈추지 않고 "에러 났어요"라고 친절하게 알려줍니다.
>     
> - **가독성:** `switch` 문을 사용해 각 도구별 처리가 명확하게 분리되어 있어, 나중에 새로운 도구를 추가하기 쉽습니다.

---

MCP Request Handler는 클라이언트 요청의 name을 기준으로 적절한 도구를 분배하고, 타입 캐스팅을 통해 args를 해당 도구의 입력 타입으로 변환한다.

---

## Core Idea
Request Handler는 호텔 프론트 데스크처럼 요청 종류(name)를 보고 적절한 담당 함수에 연결한다.
args의 타입이 도구마다 다른 이유는 각 도구가 필요로 하는 입력값(재료)이 다르기 때문이다.
`as unknown as TargetType` 패턴은 TypeScript의 타입 검증을 우회하여 런타임에 실제 타입을 지정하는 방법이다.

## Why It Matters
- MCP SDK의 args는 일반적인 Record 타입으로 전달되어 개발자가 적절한 타입으로 변환해야 한다.
- Double assertion 패턴(as unknown as)은 TypeScript에서 타입 간 직접 변환이 불가능할 때 사용하는 표준 기법이다.
- try-catch로 감싸면 도구 실행 중 에러가 나도 서버가 멈추지 않는다.

## Explanation
- 도구 목록 요청(ListToolsRequestSchema): 서버가 제공하는 기능 목록(메뉴판) 반환
- 도구 실행 요청(CallToolRequestSchema): name으로 도구 식별 후 args를 해당 타입으로 캐스팅하여 실행
- 타입 캐스팅 과정: args → unknown(타입 지우기) → TargetType(재정의)

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q: MCP에서 `as unknown as GetMocInput`처럼 두 번 캐스팅하는 이유는?
- A: TypeScript는 호환되지 않는 타입 간 직접 변환을 막으므로, unknown으로 타입을 지운 뒤 원하는 타입으로 재정의하는 것
- Q: Request Handler에서 switch문을 사용하는 이점은?
- A: 각 도구별 처리가 명확하게 분리되어 가독성이 좋고, 새로운 도구 추가가 용이함
