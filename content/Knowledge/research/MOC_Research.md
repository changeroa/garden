# Research MOC

Created:: 2025-12-24
Tags:: #MOC #research

---

## Overview
연구 논문 및 학술 자료를 정리하는 지식 맵입니다.

---

## Research Areas

### Reinforcement Learning
강화학습 관련 연구 자료입니다.

#### Predictive Response Optimization
- [[Predictive Response Optimization|PRO - Main]]
- [[precision|Precision]]
- [[recall|Recall]]
- [[Pareto frontier|Pareto Frontier]]
- [[Turing Test|Turing Test]]
- [[CAPTCHA|CAPTCHA]]

---

## Reference Materials
source 폴더의 연구 참고 자료입니다.

### RL References Structure
- 01_Foundation
- 02_Zero_Shot_Generalization_Visual_Distractions
- 03_World_Models_Latent_Dynamics
- 04_VAE_Disentanglement
- 05_Information_Bottleneck_RL
- 06_Domain_Randomization_Sim_to_Real
- 07_Contrastive_Learning_Data_Augmentation
- 08_Hard_Exploration_Atari
- 09_Sample_Efficient_RL_Atari100k
- 10_Surveys_Benchmarks

---

## Recent Research Notes
```dataview
TABLE file.mtime as "Modified", file.tags as "Topics"
FROM "01_Knowledge/Research"
WHERE file.name != "MOC_Research" AND !contains(file.path, "assets")
SORT file.mtime DESC
LIMIT 15
```

## Research by Area
```dataview
TABLE length(rows) as "Notes"
FROM "01_Knowledge/Research"
GROUP BY file.folder
SORT length(rows) DESC
```

## Source Materials
```dataview
TABLE file.mtime as "Modified"
FROM "source/RL_references"
SORT file.mtime DESC
LIMIT 10
```
