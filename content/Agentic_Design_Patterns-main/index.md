---
title: Agentic Design Patterns
---

# 🤖 Agentic Design Patterns

AI 에이전트 설계 패턴과 구현 예제를 담은 포괄적인 가이드입니다.

## 📚 핵심 문서
- [README](README.md) - 프로젝트 개요
- [Agentic Design Patterns PDF](Agentic_Design_Patterns.pdf) - 전체 가이드 PDF

## 📖 Chapter별 노트북

### 기본 패턴

#### Chapter 1: Prompt Chaining
- [Code Example](notebooks/Chapter%201_%20Prompt%20Chaining%20(Code%20Example))
- [JSON example](notebooks/Chapter%201_%20Prompt%20Chaining%20(JSON%20example))

#### Chapter 2: Routing
- [Google ADK Code Example](notebooks/Chapter%202_%20Routing%20(Google%20ADK%20Code%20Example))
- [LangGraph Code Example](notebooks/Chapter%202_%20Routing%20(LangGraph%20Code%20Example))
- [Openrouter example](notebooks/Chapter%202_%20Routing%20(Openrouter%20example))

#### Chapter 3: Parallelization
- [Google ADK Code Example](notebooks/Chapter%203_%20Parallelization%20(Google%20ADK%20Code%20Example).ipynb)
- [LangChain Code Example](notebooks/Chapter%203_%20Parallelization%20(LangChain%20Code%20Example))

#### Chapter 4: Reflection
- [ADK Code Example](notebooks/Chapter%204_%20Reflection%20(ADK%20Code%20Example))
- [Iterative Loop reflection](notebooks/Chapter%204_%20Reflection%20(Iterative%20Loop%20reflection))
- [LangChain Code Example](notebooks/Chapter%204_%20Reflection%20(LangChain%20Code%20Example))

### 도구 활용

#### Chapter 5: Tool Use
- [CrewAI Function Calling Example](notebooks/Chapter%205_%20Tool%20Use%20(CrewAI%20Function%20Calling%20Example))
- [Executing Code](notebooks/Chapter%205_%20Tool%20Use%20(Executing%20Code).ipynb)
- [LangChain Code Example](notebooks/Chapter%205_%20Tool%20Use%20(LangChain%20Code%20Example%20))
- [Vertex AI Search](notebooks/Chapter%205_%20Tool%20Use%20(Vertex%20AI%20Search).ipynb)
- [Using Google Search](notebooks/Chapter%205_%20Tool%20Use%20(using%20Google%20Search).ipynb)

### 고급 패턴

#### Chapter 6: Planning
- [Code Example](notebooks/Chapter%206_%20Planning%20-%20Code%20Example)
- [Deep Research API Example](notebooks/Chapter%206_%20Planning%20-%20Deep%20Research%20API%20%20Example)

#### Chapter 7: Multi-Agent Collaboration
- [ADK + Gemini AgentTool](notebooks/Chapter%207_%20Multi-Agent%20Collaboration%20-%20Code%20Example%20(ADK%20+%20Gemini%20AgentTooll).ipynb)
- [ADK + Gemini Coordinator](notebooks/Chapter%207_%20Multi-Agent%20Collaboration%20-%20Code%20Example%20(ADK%20+%20Gemini%20Coordinator).ipynb)
- [ADK + Gemini Loop](notebooks/Chapter%207_%20Multi-Agent%20Collaboration%20-%20Code%20Example%20(ADK%20+%20Gemini%20Loop).ipynb)
- [ADK + Gemini Parallel](notebooks/Chapter%207_%20Multi-Agent%20Collaboration%20-%20Code%20Example%20(ADK%20+%20Gemini%20Parallel).ipynb)
- [ADK + Gemini Sequential](notebooks/Chapter%207_%20Multi-Agent%20Collaboration%20-%20Code%20Example%20(ADK%20+%20Gemini%20Sequential).ipynb)
- [CrewAI + Gemini](notebooks/Chapter%207_%20Multi-Agent%20Collaboration%20-%20Code%20Example%20(CrewAI%20+%20Gemini))

#### Chapter 8: Memory Management
- [ADK Conceptual Example](notebooks/Chapter%208_%20Memory%20Management%20-%20Code%20Example%20(ADK%20Conceptual%20Example_%20Explicit%20State%20Update%20via%20EventActions))
- [ADK LlmAgent output_key Example](notebooks/Chapter%208_%20Memory%20Management%20-%20Code%20Example%20(ADK%20LlmAgent%20output_key%20Example))
- [ADK MemoryService InMemory Example](notebooks/Chapter%208_%20Memory%20Management%20-%20Code%20Example%20(ADK%20MemoryService%20InMemory%20Example))
- [ADK SessionService InMemory and Database](notebooks/Chapter%208_%20Memory%20Management%20-%20Code%20Example%20(ADK%20SessionService%20InMemory%20and%20Database))
- [LangChain and LangGraph](notebooks/Chapter%208_%20Memory%20Management%20-%20Code%20Example%20(LangChain%20and%20LangGraph))

### 프로토콜 & 통신

#### Chapter 10: Model Context Protocol (MCP)
- [ADK Agent Consuming FastMCP Server](notebooks/Chapter%2010_%20Model%20Context%20Protocol%20(ADK%20Agent%20Consuming%20FastMCP%20Server))
- [FastMCP Server Example](notebooks/Chapter%2010_%20Model%20Context%20Protocol%20(FastMCP%20Server%20Example))
- [__init__.py for FastMCP Client Agent](notebooks/Chapter%2010_%20Model%20Context%20Protocol%20(__init__.py%20for%20FastMCP%20Client%20Agent))
- [__init__.py for MCP Filesystem Example](notebooks/Chapter%2010_%20Model%20Context%20Protocol%20(__init__.py%20for%20MCP%20Filesystem%20Example))
- [agent.py for MCP Filesystem Example](notebooks/Chapter%2010_%20Model%20Context%20Protocol%20(agent.py%20for%20MCP%20Filesystem%20Example))

### 실전 패턴

#### Chapter 11-14: 목표 설정부터 지식 검색까지
- [Goal Setting and Monitoring](notebooks/Chapter%2011_%20Goal%20Setting%20and%20Monitoring%20(Goal_Setting_Iteration).ipynb)
- [Exception Handling and Recovery](notebooks/Chapter%2012_%20Exception%20Handling%20and%20Recovery%20(Agent%20with%20Fallback))
- [Human-in-the-Loop](notebooks/Chapter%2013_%20Human-in-the-Loop%20(Customer%20Support%20Agent%20with%20Personalization%20and%20Escalation))
- [Knowledge Retrieval (RAG LangChain)](notebooks/Chapter%2014_%20Knowledge%20Retrieval%20(RAG%20%20LangChain))
- [Knowledge Retrieval (RAG Google Search)](notebooks/Chapter%2014_%20Knowledge%20Retrieval%20(RAG%20Google%20Search))
- [Knowledge Retrieval (RAG VertexAI)](notebooks/Chapter%2014_%20Knowledge%20Retrieval%20(RAG%20VertexAI))

#### Chapter 15-21: 고급 통신과 최적화
- [Inter-Agent Communication](notebooks/Chapter%2015_%20Inter-Agent%20Communication%20(A2A))
- [Resource-Aware Optimization](notebooks/Chapter%2016_%20Resource-Aware%20Optimization%20(OI%20and%20Google%20search))
- [Reasoning Techniques](notebooks/Chapter%2017_%20Reasoning%20Techniques%20(Google%20DeepSearch))
- [Guardrails & Safety Patterns](notebooks/Chapter%2018_%20Guardrails_Safety%20Patterns%20(ADK%20validate%20tool))
- [Evaluation and Monitoring](notebooks/Chapter%2019_%20Evaluation%20and%20Monitoring%20(LLM%20as%20a%20Judge))
- [Prioritization](notebooks/Chapter%2020_%20Prioritization%20(SuperSimplePM))
- [Exploration and Discovery](notebooks/Chapter%2021_%20Chapter%2021_%20Exploration%20and%20Discovery(Agent%20Laboratory))

### 부록
- [Appendix: Pydantic](notebooks/Appendix_%20Pydantic)
- [Appendix C](notebooks/Appendix%20C_)

## 🎓 학습 경로

### 초급자
1. Prompt Chaining → Routing 기초
2. Tool Use 기본 예제
3. Simple Reflection 패턴

### 중급자
1. Multi-Agent Collaboration
2. Memory Management
3. Planning 전략

### 고급자
1. Model Context Protocol
2. Resource-Aware Optimization
3. Guardrails & Safety Patterns

## 🔗 관련 문서
- [Context Engineering](/Context_Engineering/) - LLM 컨텍스트 최적화