---
date created: 2025-12-25 01:22
date modified: 2025-12-25 01:24
---

Created: 2025-12-29 18:12
Modified: 2025-12-29 18:12
TemplateVersion: v1
Status: #status/seedling
Category:
Tags: #knowledge
Up::
Related::

---



```html
%% DOCTYPE이 html이라는 선언이지, 이것을 마크업이라고 볼 수는 없다. %%
<!DOCTYPE html>
<html>
<head>
	%% 페이지의 시작은 "제목", 제목은 파비콘과 텍스트 제목, 파비콘은 업계 표준은 아니나 크롬을 필두로 관행처럼 사용되는 중  %%
	<link rel="icon" href="favicon.png" type="image/png">
	<title>Simple Page</title>

  
	%% 제목 다음은 계속 사용할 도구뭉치들을 정의한다. "스타일, 스크립트" => 템플릿 순으로 나열한다. 스타일은과 스크립트는 전역변수같은 성격을 가지고, 템플릿은 보다 라이브러리적인 성격을 둬서 앞에 둔다%%
	<style>

  
  
  

	html {font-size:16px;}

  
  
  

	body {color:#333; font-family:system-ui, -apple-system, sans-serif; line-height:1.6; max-width:800px; margin:40px auto; padding:0 20px;}

  
  
  

</style>

<script>

  
  
  

window.onload = async () => {

  
  
  
  

//alert('vjfmjfjhfjhfhjf');

  
  
  

document.body.innerHTML = await (await fetch('/m/' + 'landing' + '.html')).text();

  
  
  
  
  

};

  
  
  
  
  
  

</script>

<template>

  

uiylgtiugtli

  
  

<style>

  
  
  

</style>

</template>

</head>

<body>

</body>

</html>

```





---

## One Line Definition


## Core Idea


## Why It Matters
-

## Explanation
-

## Connections
- **확장**: [[]] - 이 개념을 확장하면...

- **적용**: [[]] - 이것을 적용할 수 있는 곳은...

## Self-Test
- Q:
- A:

## Open Questions
- 아직 이해 안 되는 것:
