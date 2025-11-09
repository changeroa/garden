/**
 * ==========================================
 * Uber 셰이더 시스템: 통합 GPU 렌더링 파이프라인
 * ==========================================
 * 
 * 📖 목적: 모든 노드 타입을 단일 셰이더로 처리하여 GPU 렌더링 효율성 극대화
 * 🏗️ 구조: 버텍스 셰이더 + 프래그먼트 셰이더 + 인스턴스 렌더링 + SDF 기반 그래픽
 * 🔄 흐름: 속성 준비 → 버텍스 변환 → 래스터화 → 프래그먼트 셰이딩 → 블렌딩
 * 🎯 핵심 개념: 인스턴스 렌더링, SDF (Signed Distance Fields), GPU 병렬처리, 단일 셰이더
 * 
 * 💡 설계 의도: 
 *   - 드로우 콜 최소화로 CPU-GPU 병목 해소
 *   - SDF 기반 벡터 그래픽으로 확대해도 부드러운 렌더링
 *   - 인스턴싱으로 대량 노드 동시 처리
 * 
 * 🔄 대안 방법: 
 *   - 노드별 개별 셰이더: 유연하지만 드로우 콜 폭발
 *   - 스프라이트 기반: 빠르지만 확대 시 픽셀화
 *   - Canvas 2D API: 단순하지만 성능 한계 명확
 * 
 * ⚠️ 주의사항: 
 *   - WebGL 2.0 필수 (인스턴싱과 GLSL ES 3.00)
 *   - 모바일 GPU에서 SDF 계산 비용 높을 수 있음
 *   - 셰이더 컴파일 실패 시 fallback 메커니즘 필요
 */

// ShaderCompileResult: 셰이더 컴파일 결과와 오류 정보
export interface ShaderCompileResult {
  success: boolean;         // 컴파일 성공 여부 | true/false
  program?: WebGLProgram;   // 컴파일된 셰이더 프로그램 | 성공 시에만 존재
  error?: string;           // 오류 메시지 | 실패 시 디버깅 정보
  compileTime: number;      // 컴파일 소요 시간 | 성능 분석용 (밀리초)
}

// ShaderUniforms: 셰이더 유니폼 변수들 (GPU로 전송되는 전역 상수)
export interface ShaderUniforms {
  u_viewMatrix: Float32Array;    // 3x3 뷰 변환 행렬 | 월드→화면 좌표 변환
  u_resolution: Float32Array;    // 화면 해상도 (width, height) | 정규화 계산용
  u_time: number;                // 애니메이션 시간 | 초 단위, 효과 애니메이션용
  u_borderWidth: number;         // 테두리 두께 | 픽셀 단위
  u_selectionColor: Float32Array; // 선택 하이라이트 색상 | RGBA (0-1 범위)
  u_cornerRadius: number;        // 모서리 둥글기 반지름 | 0-1 정규화된 값
}

/**
 * ==========================================
 * UberShader 클래스: 통합 WebGL 셰이더 관리자
 * ==========================================
 * 
 * 📖 목적: 모든 노드 타입을 스단일 셰이더로 처리하여 드로우 콜 최소화
 * 🏗️ 구조: 
 *   - WebGL 컴파일러를 사용한 GLSL 소스 컴파일
 *   - 유니폼과 어트리뷐트 위치 캐싱 시스템
 *   - 인스턴스 렌더링을 위한 버텀 어레이 어트리뷐트 최적화
 * 🔄 흐름: 셰이더 컴파일 → 분팩 → 유니폼/어트리뷐트 설정 → 렌더링
 * 🎯 핵심 개념: 
 *   - SDF 기반 둥근 사각형 렌더링 (Signed Distance Fields)
 *   - 인스턴스 렌더링으로 대량 노드 동시 처리
 *   - 선택 상태 하이라이트와 안티앨리어싱 지원
 * 
 * 💡 설계 의도: AI 문맥 준비 도구에 맞는 단순하고 효과적인 접근
 * 🔄 대안 방법: 복잡한 비주얼 이팩트보다 성능에 초점
 * ⚠️ 주의사항: 셰이더 컴파일 실패 시 적절한 오류 처리와 폴백 필요
 */
export class UberShader {
  private gl: WebGL2RenderingContext;     // WebGL 2.0 컴텍스트 | 인스턴스 렌더링 지원 필수
  private program: WebGLProgram | null = null; // 컴파일된 셰이더 프로그램 | null이면 아직 컴파일 안됨
  private uniforms = new Map<string, WebGLUniformLocation>(); // 유니폼 위치 캐시 | 이름 → 위치 매핑
  private attributes = new Map<string, number>(); // 어트리뷐트 인덱스 캐시 | 이름 → 인덱스 매핑
  
  /**
   * ==========================================
   * 버텍스 셰이더: 3D 좌표 변환과 인스턴스 렌더링 담당
   * ==========================================
   * 
   * 📖 목적: 각 노드를 화면 좌표로 변환하고 프래그먼트 셰이더에 데이터 전달
   * 🎯 핵심 기능:
   *   - 인스턴스별 위치/크기 적용
   *   - 월드 좌표 → 정규화된 디바이스 좌표 변환
   *   - 지역 좌표계 계산으로 SDF 준비
   */
  private vertexShaderSource = `#version 300 es  
    precision mediump float; // 중간 정밀도 | 성능과 품질 균형
    
    // 기본 쿼드 버텍스 (인스턴스마다 재사용)
    in vec2 a_position; // -0.5~0.5 범위의 버텍스 좌표 | 6개 버텍스로 사각형 구성
    
    // 인스턴스 어트리뷐트 (노드별 데이터)
    in vec2 a_instancePos;   // 노드 중심 위치 | 월드 좌표계
    in vec2 a_instanceSize;  // 노드 크기 | 픽셀 단위 (width, height)
    in vec4 a_instanceColor; // 노드 색상 | RGBA (0.0-1.0 범위)
    in float a_nodeType;     // 노드 타입 | 0-9 정수, 향후 다른 모양 처리 예비
    in float a_selected;     // 선택 상태 | 0.0 또는 1.0, 변경 하이라이트용
    
    // 유니폼 변수 (모든 인스턴스 공통)
    uniform mat3 u_viewMatrix;  // 3x3 뷰 변환 행렬 | 팬/줌/이동 동시 처리
    uniform vec2 u_resolution;  // 캔버스 해상도 | 정규화 좌표 변환용
    uniform float u_time;       // 애니메이션 시간 | 초 단위, 선택 사항
    
    // 프래그먼트 셰이더로 전달될 변수들
    out vec4 v_color;    // 보간된 색상 | 프래그먼트에서 기본 색상으로 사용
    out float v_nodeType;// 보간된 노드 타입 | 향후 타입별 렌더링용
    out float v_selected;// 보간된 선택 상태 | 하이라이트 효과용
    out vec2 v_localPos; // 지역 좌표 | SDF 계산용 (0.0-1.0 범위)
    
    void main() {
      // 월드 좌표 계산 | 기본 쿼드를 노드 크기로 스케일링하고 위치 이동
      vec2 worldPos = a_position * a_instanceSize + a_instancePos;
      
      // 뷰 변환 적용 | 3x3 행렬로 2D 변환 + 이동/회전/스케일 동시 처리
      vec3 viewPos = u_viewMatrix * vec3(worldPos, 1.0); // 동차 좌표로 변환
      gl_Position = vec4(viewPos.xy, 0.0, 1.0); // 정규화된 디바이스 좌표 (-1 ~ 1)
      
      // 프래그먼트 셰이더로 데이터 전달
      v_color = a_instanceColor;                    // 인스턴스 색상 그대로 전달
      v_nodeType = a_nodeType;                      // 노드 타입 그대로 전달
      v_selected = a_selected;                      // 선택 상태 그대로 전달
      v_localPos = a_position * 0.5 + 0.5;         // -0.5~0.5 → 0.0~1.0 변환 | SDF에서 사용
    }
  `;
  
  /**
   * ==========================================
   * 프래그먼트 셰이더: 픽셀별 시각적 외관 렌더링
   * ==========================================
   * 
   * 📖 목적: SDF 기반 둥근 사각형과 선택 하이라이트 효과 구현
   * 🎯 핵심 기능:
   *   - SDF 수학으로 벡터 그래픽 구현
   *   - 안티앨리어싱으로 부드러운 경계
   *   - 선택 상태에 따른 동적 색상 혼합
   * 
   * ⚠️ SDF 기초: Signed Distance Field는 각 픽셀에서 도형의 경계까지 거리를 계산
   *     음수 = 도형 내부, 양수 = 도형 외부, 0 = 정확히 경계선
   */
  private fragmentShaderSource = `#version 300 es
    precision mediump float; // 중간 정밀도 | 모바일 GPU 호환성
    
    // 버텍스 셰이더에서 전달받은 변수들 (보간된 값)
    in vec4 v_color;     // 보간된 노드 색상 | 인접 버텍스 간 선형 보간
    in float v_nodeType; // 보간된 노드 타입 | 현재는 미사용, 향후 확장용
    in float v_selected; // 보간된 선택 상태 | 0.0 또는 1.0 값
    in vec2 v_localPos;  // 지역 좌표 | 0.0-1.0 범위, SDF 계산 기준
    
    // 스타일링용 유니폼 변수들
    uniform float u_borderWidth;    // 테두리 두께 | 픽셀 단위, 선택 하이라이트 둘기용
    uniform vec4 u_selectionColor;  // 선택 하이라이트 색상 | RGBA (0.0-1.0)
    uniform float u_cornerRadius;   // 모서리 둥글기 반지름 | 0.0-1.0 정규화된 값
    
    out vec4 fragColor; // 최종 픽셀 색상 출력
    
    void main() {
      vec2 center = vec2(0.5, 0.5); // 사각형 중심점 | 지역 좌표계 기준
      vec2 pos = v_localPos;         // 현재 픽셀 위치
      
      // SDF를 사용한 둥근 사각형 계산
      // 수학적 원리: 중심에서 모서리반지름만큼 내부의 사각형 + 둥근 모서리 원
      vec2 size = vec2(0.5 - u_cornerRadius);  // 내부 사각형 크기 | 모서리 반지름 제외
      vec2 d = abs(pos - center) - size;       // 픽셀에서 사각형 경계까지 거리 벡터
      // SDF 수식: 사각형 외부 = 거리벡터 크기, 내부 = 최대 구성요소, 모서리 = 둥근 보정
      float distance = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - u_cornerRadius;
      
      // 기본 노드 색상 설정
      vec4 nodeColor = v_color;
      
      // 선택 상태 하이라이트 처리
      if (v_selected > 0.5) { // 0.5 임계값으로 이진 선택 판단
        // smoothstep으로 부드러운 경계 전환 | 테두리 영역에서만 하이라이트
        float selectionMix = smoothstep(-u_borderWidth, 0.0, distance);
        // mix 함수로 선택 색상과 기본 색상 블렌딩
        nodeColor = mix(u_selectionColor, nodeColor, selectionMix);
      }
      
      // 안티앨리어싱 | SDF 거리를 이용한 부드러운 알파 전환
      float alpha = 1.0 - smoothstep(-0.001, 0.001, distance); // 0.002 픽셀 범위 부드럽게 전환
      
      // 최종 색상 출력 | RGB는 유지, 알파만 SDF로 조절
      fragColor = vec4(nodeColor.rgb, nodeColor.a * alpha);
    }
  `;
  
  private debug = false;
  
  constructor(gl: WebGL2RenderingContext, debug = false) {
    this.gl = gl;
    this.debug = debug;
  }
  
  /**
   * Compile and link the uber shader
   */
  compile(): ShaderCompileResult {
    const startTime = performance.now();
    
    try {
      // Compile vertex shader
      const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
      if (!vertexShader) {
        return { success: false, error: 'Failed to compile vertex shader', compileTime: 0 };
      }
      
      // Compile fragment shader  
      const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
      if (!fragmentShader) {
        this.gl.deleteShader(vertexShader);
        return { success: false, error: 'Failed to compile fragment shader', compileTime: 0 };
      }
      
      // Create and link program
      const program = this.gl.createProgram();
      if (!program) {
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
        return { success: false, error: 'Failed to create shader program', compileTime: 0 };
      }
      
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);
      
      // Check linking status
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        const error = this.gl.getProgramInfoLog(program) || 'Unknown linking error';
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
        this.gl.deleteProgram(program);
        return { success: false, error, compileTime: 0 };
      }
      
      // Clean up shaders (they're now in the program)
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);
      
      // Store program and get uniform/attribute locations
      this.program = program;
      this.setupUniformsAndAttributes();
      
      const compileTime = performance.now() - startTime;
      
      if (this.debug) {
        console.log(`Uber shader compiled successfully in ${compileTime.toFixed(2)}ms`);
      }
      
      return { success: true, program, compileTime };
      
    } catch (error) {
      const compileTime = performance.now() - startTime;
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        compileTime
      };
    }
  }
  
  /**
   * Compile individual shader
   */
  private compileShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      if (this.debug) {
        console.error('Shader compilation error:', error);
        console.error('Source:', source);
      }
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  /**
   * Get uniform and attribute locations
   */
  private setupUniformsAndAttributes(): void {
    if (!this.program) return;
    
    // Uniform locations
    const uniformNames = [
      'u_viewMatrix',
      'u_resolution', 
      'u_time',
      'u_borderWidth',
      'u_selectionColor',
      'u_cornerRadius'
    ];
    
    for (const name of uniformNames) {
      const location = this.gl.getUniformLocation(this.program, name);
      if (location !== null) {
        this.uniforms.set(name, location);
      } else if (this.debug) {
        console.warn(`Uniform '${name}' not found or not used`);
      }
    }
    
    // Attribute locations
    const attributeNames = [
      'a_position',
      'a_instancePos',
      'a_instanceSize', 
      'a_instanceColor',
      'a_nodeType',
      'a_selected'
    ];
    
    for (const name of attributeNames) {
      const location = this.gl.getAttribLocation(this.program, name);
      if (location !== -1) {
        this.attributes.set(name, location);
      } else if (this.debug) {
        console.warn(`Attribute '${name}' not found or not used`);
      }
    }
  }
  
  /**
   * Use this shader program
   */
  use(): boolean {
    if (!this.program) return false;
    
    this.gl.useProgram(this.program);
    return true;
  }
  
  /**
   * Set shader uniforms
   */
  setUniforms(uniforms: Partial<ShaderUniforms>): void {
    if (!this.program) return;
    
    if (uniforms.u_viewMatrix) {
      const location = this.uniforms.get('u_viewMatrix');
      if (location) {
        this.gl.uniformMatrix3fv(location, false, uniforms.u_viewMatrix);
      }
    }
    
    if (uniforms.u_resolution) {
      const location = this.uniforms.get('u_resolution');
      if (location) {
        this.gl.uniform2fv(location, uniforms.u_resolution);
      }
    }
    
    if (uniforms.u_time !== undefined) {
      const location = this.uniforms.get('u_time');
      if (location) {
        this.gl.uniform1f(location, uniforms.u_time);
      }
    }
    
    if (uniforms.u_borderWidth !== undefined) {
      const location = this.uniforms.get('u_borderWidth');
      if (location) {
        this.gl.uniform1f(location, uniforms.u_borderWidth);
      }
    }
    
    if (uniforms.u_selectionColor) {
      const location = this.uniforms.get('u_selectionColor');
      if (location) {
        this.gl.uniform4fv(location, uniforms.u_selectionColor);
      }
    }
    
    if (uniforms.u_cornerRadius !== undefined) {
      const location = this.uniforms.get('u_cornerRadius');
      if (location) {
        this.gl.uniform1f(location, uniforms.u_cornerRadius);
      }
    }
  }
  
  /**
   * Get attribute location
   */
  getAttributeLocation(name: string): number {
    return this.attributes.get(name) ?? -1;
  }
  
  /**
   * Get uniform location
   */
  getUniformLocation(name: string): WebGLUniformLocation | null {
    return this.uniforms.get(name) ?? null;
  }
  
  /**
   * Check if shader is ready to use
   */
  isReady(): boolean {
    return this.program !== null;
  }
  
  /**
   * Dispose shader resources
   */
  dispose(): void {
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    
    this.uniforms.clear();
    this.attributes.clear();
    
    if (this.debug) {
      console.log('Uber shader disposed');
    }
  }
}
