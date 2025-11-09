---
title: Agentic Design Patterns
---

# 🤖 Agentic Design Patterns

AI 에이전트 설계 패턴과 구현 예제를 담은 포괄적인 가이드입니다.

## 📚 핵심 문서
- [README](README) - 프로젝트 개요
- [Agentic Design Patterns PDF](Agentic_Design_Patterns.pdf) - 전체 가이드 PDF

## 📖 Chapter별 노트북

### 기본 패턴

#### Chapter 1: Prompt Chaining
- [Code Example](notebooks/Chapter-1_-Prompt-Chaining-(Code-Example))
- [JSON example](notebooks/Chapter-1_-Prompt-Chaining-(JSON-example))

#### Chapter 2: Routing
- [Google ADK Code Example](notebooks/Chapter-2_-Routing-(Google-ADK-Code-Example))
- [LangGraph Code Example](notebooks/Chapter-2_-Routing-(LangGraph-Code-Example))
- [Openrouter example](notebooks/Chapter-2_-Routing-(Openrouter-example))

#### Chapter 3: Parallelization
- [Google ADK Code Example](notebooks/Chapter-3_-Parallelization-(Google-ADK-Code-Example).ipynb)
- [LangChain Code Example](notebooks/Chapter-3_-Parallelization-(LangChain-Code-Example))

#### Chapter 4: Reflection
- [ADK Code Example](notebooks/Chapter-4_-Reflection-(ADK-Code-Example))
- [Iterative Loop reflection](notebooks/Chapter-4_-Reflection-(Iterative-Loop-reflection))
- [LangChain Code Example](notebooks/Chapter-4_-Reflection-(LangChain-Code-Example))

### 도구 활용

#### Chapter 5: Tool Use
- [CrewAI Function Calling Example](notebooks/Chapter-5_-Tool-Use-(CrewAI-Function-Calling-Example))
- [Executing Code](notebooks/Chapter-5_-Tool-Use-(Executing-Code).ipynb)
- [LangChain Code Example](notebooks/Chapter-5_-Tool-Use-(LangChain-Code-Example-))
- [Vertex AI Search](notebooks/Chapter-5_-Tool-Use-(Vertex-AI-Search).ipynb)
- [Using Google Search](notebooks/Chapter-5_-Tool-Use-(using-Google-Search).ipynb)

### 고급 패턴

#### Chapter 6: Planning
- [Code Example](notebooks/Chapter-6_-Planning---Code-Example)
- [Deep Research API Example](notebooks/Chapter-6_-Planning---Deep-Research-API--Example)

#### Chapter 7: Multi-Agent Collaboration
- [ADK + Gemini AgentTool](notebooks/Chapter-7_-Multi-Agent-Collaboration---Code-Example-(ADK-+-Gemini-AgentTooll).ipynb)
- [ADK + Gemini Coordinator](notebooks/Chapter-7_-Multi-Agent-Collaboration---Code-Example-(ADK-+-Gemini-Coordinator).ipynb)
- [ADK + Gemini Loop](notebooks/Chapter-7_-Multi-Agent-Collaboration---Code-Example-(ADK-+-Gemini-Loop).ipynb)
- [ADK + Gemini Parallel](notebooks/Chapter-7_-Multi-Agent-Collaboration---Code-Example-(ADK-+-Gemini-Parallel).ipynb)
- [ADK + Gemini Sequential](notebooks/Chapter-7_-Multi-Agent-Collaboration---Code-Example-(ADK-+-Gemini-Sequential).ipynb)
- [CrewAI + Gemini](notebooks/Chapter-7_-Multi-Agent-Collaboration---Code-Example-(CrewAI-+-Gemini))

#### Chapter 8: Memory Management
- [ADK Conceptual Example](notebooks/Chapter-8_-Memory-Management---Code-Example-(ADK-Conceptual-Example_-Explicit-State-Update-via-EventActions))
- [ADK LlmAgent output_key Example](notebooks/Chapter-8_-Memory-Management---Code-Example-(ADK-LlmAgent-output_key-Example))
- [ADK MemoryService InMemory Example](notebooks/Chapter-8_-Memory-Management---Code-Example-(ADK-MemoryService-InMemory-Example))
- [ADK SessionService InMemory and Database](notebooks/Chapter-8_-Memory-Management---Code-Example-(ADK-SessionService-InMemory-and-Database))
- [LangChain and LangGraph](notebooks/Chapter-8_-Memory-Management---Code-Example-(LangChain-and-LangGraph))

### 프로토콜 & 통신

#### Chapter 10: Model Context Protocol (MCP)
- [ADK Agent Consuming FastMCP Server](notebooks/Chapter-10_-Model-Context-Protocol-(ADK-Agent-Consuming-FastMCP-Server))
- [FastMCP Server Example](notebooks/Chapter-10_-Model-Context-Protocol-(FastMCP-Server-Example))
- [__init__.py for FastMCP Client Agent](notebooks/Chapter-10_-Model-Context-Protocol-(__init__.py-for-FastMCP-Client-Agent))
- [__init__.py for MCP Filesystem Example](notebooks/Chapter-10_-Model-Context-Protocol-(__init__.py-for-MCP-Filesystem-Example))
- [agent.py for MCP Filesystem Example](notebooks/Chapter-10_-Model-Context-Protocol-(agent.py-for-MCP-Filesystem-Example))

### 실전 패턴

#### Chapter 11-14: 목표 설정부터 지식 검색까지
- [Goal Setting and Monitoring](notebooks/Chapter-11_-Goal-Setting-and-Monitoring-(Goal_Setting_Iteration).ipynb)
- [Exception Handling and Recovery](notebooks/Chapter-12_-Exception-Handling-and-Recovery-(Agent-with-Fallback))
- [Human-in-the-Loop](notebooks/Chapter-13_-Human-in-the-Loop-(Customer-Support-Agent-with-Personalization-and-Escalation))
- [Knowledge Retrieval (RAG LangChain)](notebooks/Chapter-14_-Knowledge-Retrieval-(RAG--LangChain))
- [Knowledge Retrieval (RAG Google Search)](notebooks/Chapter-14_-Knowledge-Retrieval-(RAG-Google-Search))
- [Knowledge Retrieval (RAG VertexAI)](notebooks/Chapter-14_-Knowledge-Retrieval-(RAG-VertexAI))

#### Chapter 15-21: 고급 통신과 최적화
- [Inter-Agent Communication](notebooks/Chapter-15_-Inter-Agent-Communication-(A2A))
- [Resource-Aware Optimization](notebooks/Chapter-16_-Resource-Aware-Optimization-(OI-and-Google-search))
- [Reasoning Techniques](notebooks/Chapter-17_-Reasoning-Techniques-(Google-DeepSearch))
- [Guardrails & Safety Patterns](notebooks/Chapter-18_-Guardrails_Safety-Patterns-(ADK-validate-tool))
- [Evaluation and Monitoring](notebooks/Chapter-19_-Evaluation-and-Monitoring-(LLM-as-a-Judge))
- [Prioritization](notebooks/Chapter-20_-Prioritization-(SuperSimplePM))
- [Exploration and Discovery](notebooks/Chapter-21_-Chapter-21_-Exploration-and-Discovery(Agent-Laboratory))

### 부록
- [Appendix: Pydantic](notebooks/Appendix_-Pydantic)
- [Appendix C](notebooks/Appendix-C_)

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