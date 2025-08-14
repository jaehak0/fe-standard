# 팀플넷 프론트엔드 표준 프로젝트

## 프로젝트 개요
- Vue 3 + TypeScript + Vite 기반의 프론트엔드 프로젝트
- 사용자 관리 기능 구현 (목록 조회, 상세 정보, 추가, 수정, 삭제)
- Pinia를 활용한 상태 관리
- Axios를 이용한 API 통신

## 기술 스택
- **프레임워크**: Vue 3 (Composition API, `<script setup>` 문법)
- **언어**: TypeScript
- **빌드 도구**: Vite
- **상태 관리**: Pinia
- **HTTP 클라이언트**: Axios
- **스타일**: Scoped CSS

## 프로젝트 구조
```
my-vue-app/
├── public/                # 정적 파일
├── src/
│   ├── api/               # API 관련 파일
│   │   ├── types.ts       # 타입 정의
│   │   └── userApi.ts     # API 호출 함수
│   ├── assets/            # 이미지, 폰트 등 자산
│   ├── components/        # 컴포넌트
│   │   ├── popup/         # 팝업 컴포넌트
│   │   │   ├── CommonConfirmPop.vue  # 공통 확인 팝업
│   │   │   ├── ToastMessage.vue      # 토스트 메시지
│   │   │   └── UserEditPop.vue       # 사용자 편집 팝업
│   │   ├── FooterSection.vue         # 푸터 컴포넌트
│   │   ├── HeaderSection.vue         # 헤더 컴포넌트
│   │   ├── MainPage.vue              # 메인 페이지
│   │   ├── UserDetail.vue            # 사용자 상세 정보
│   │   └── UserTable.vue             # 사용자 테이블
│   ├── stores/            # Pinia 스토어
│   │   └── userStore.ts   # 사용자 관련 상태 관리
│   ├── App.vue            # 루트 컴포넌트
│   ├── main.ts            # 진입점
│   └── style.css          # 전역 스타일
├── index.html             # HTML 템플릿
├── package.json           # 의존성 및 스크립트
└── vite.config.ts         # Vite 설정
```

## 코드 컨벤션 및 특징

### 1. 파일 및 폴더 네이밍 컨벤션
- **폴더명**:
  - 기능/역할별 구분: `components`, `api`, `stores`, `assets` 등 복수형으로 표현
  - 하위 폴더는 기능별 그룹핑: `components/popup/`
  - 모두 소문자 사용 (kebab-case 또는 단일 단어)
  
- **파일명**:
  - **Vue 컴포넌트**: PascalCase 사용 (예: `UserTable.vue`, `HeaderSection.vue`)
    - 페이지 컴포넌트: `MainPage.vue`
    - 섹션 컴포넌트: `HeaderSection.vue`, `FooterSection.vue`
    - 기능 컴포넌트: `UserTable.vue`, `UserDetail.vue`
    - 팝업 컴포넌트: `UserEditPop.vue`, `CommonConfirmPop.vue`
  
  - **TypeScript 파일**:
    - 스토어: `userStore.ts` (camelCase)
    - API 관련: `userApi.ts` (camelCase)
    - 타입 정의: `types.ts` (복수형, 일반명사)
  
  - **CSS 파일**: 소문자 사용 (예: `style.css`)

### 2. 변수 네이밍 컨벤션
- **접두사 규칙**:
  - 전역 변수는 `g_` 접두사 사용:
    ```javascript
    const g_userStore = useUserStore();
    const g_editMode = ref("add");
    const g_showUpdateModal = ref(false);
    ```
  
  - 지역/일반 변수는 접두사 없이 camelCase 사용:
    ```javascript
    const userData = { ... };
    let value = e.target.value;
    ```

- **상태 변수**:
  - Boolean 변수는 `is`, `has`, `show` 등의 접두사 사용:
    ```javascript
    const g_showUpdateModal = ref(false);
    const g_isMobile = ref(window.innerWidth <= 820);
    ```
  
  - 참조 객체는 명사형으로 표현:
    ```javascript
    const g_userDetail = reactive({ ... });
    const g_editUser = ref(null);
    ```

### 3. 함수 네이밍 컨벤션
- **이벤트 핸들러**: `on` 접두사 사용
  ```javascript
  function onBtnSubmit() { ... }
  function onClickUser(idx) { ... }
  function onWindowResizing() { ... }
  ```

- **동작 함수**: 동사로 시작
  ```javascript
  function showToast(msg) { ... }
  function hideUserPop() { ... }
  function formatPhone(e) { ... }
  ```

- **API 호출 함수**: `req` 접두사 사용
  ```javascript
  async function reqUserList(params) { ... }
  async function reqInsertUser(user) { ... }
  ```

- **콜백 함수**: `callback` 접두사 사용
  ```javascript
  function callbackCommPopConfirm() { ... }
  function callbackCommPopCancel() { ... }
  ```

### 4. 컴포넌트 구조 컨벤션
- **파일 구조**: 일관된 순서로 구성
  ```vue
  <script setup>
  // 1. 임포트
  // 2. props 정의
  // 3. 변수 선언
  // 4. 함수 정의
  // 5. 생명주기 훅
  </script>

  <template>
  <!-- 템플릿 코드 -->
  </template>

  <style scoped>
  /* 스타일 코드 */
  </style>
  ```

- **Props 네이밍**:
  - camelCase 사용
  - 명확한 의미 전달을 위한 이름 사용
  ```javascript
  const g_propsFromParentEvt = defineProps({
    visible: Boolean,
    user: Object,
    mode: { type: String, default: "add" },
    onClose: Function,
    onSubmit: Function,
  });
  ```

### 5. CSS 스타일 컨벤션
- **스코프 스타일**: `<style scoped>` 사용으로 컴포넌트 스타일 캡슐화
- **클래스 네이밍**: 기능-요소 형태의 kebab-case 사용
  ```css
  .modal-header { ... }
  .form-row { ... }
  .gender-radio-group { ... }
  ```

- **반응형 디자인**: 미디어 쿼리를 통한 모바일 대응
  ```css
  @media (max-width: 820px) {
    .layout-main {
      flex-direction: column;
    }
  }
  ```

### 6. API 통신 컨벤션
- **함수 구조**: 일관된 패턴 사용
  ```javascript
  export async function reqUserList(params) {
    const { data } = await axios.post<UserListResponse>(
      `${BASE_URL}/member/getMemberList`,
      params || {}
    );
    return data;
  }
  ```

- **타입 안전성**: TypeScript 인터페이스 활용
  ```typescript
  export interface User {
    user_key: number;
    nick: string;
    age: number;
    phone: string;
    email: string;
    gender: string; // "M" 또는 "F"
  }
  ```

### 7. 상태 관리 컨벤션
- **스토어 구조**: Composition API 스타일 사용
  ```javascript
  export const useUserStore = defineStore("user", () => {
    const users = ref<User[]>([]);
    // 상태 정의
    
    // 액션 함수
    async function searchUserList(params) { ... }
    
    return {
      // 노출할 상태와 액션
      users,
      searchUserList,
    };
  });
  ```

### 8. 주석 컨벤션
- **코드 섹션 구분**: 명확한 구분선 사용
  ```javascript
  // =========================
  // API 서버 생존 여부
  // =========================
  ```

- **함수 설명**: JSDoc 스타일 주석
  ```javascript
  /** 1. 회원 목록 조회 */
  export async function reqUserList(params) { ... }
  ```

- **TODO 주석**: 개선 필요 사항 표시
  ```javascript
  // showToast의 message, setTimeout을 공통함수를 빼야함.
  ```

- **인라인 주석**: 중요 로직 설명
  ```javascript
  g_userDetail.gender = "M"; // 기본값
  ```

## 실무 도움 팁

### 1. 코드 구조화 전략
- **컴포넌트 분리**: 기능별로 컴포넌트 분리하여 재사용성 높임
- **공통 컴포넌트**: 팝업, 토스트 등 공통 UI 요소 분리
- **관심사 분리**: API 호출, 상태 관리, UI 렌더링 등 역할 분리

### 2. 디버깅 및 개발 팁
- **콘솔 로그**: 주요 지점에 로그 추가 (예: `console.log("여기?", userData)`)
- **주석 활용**: 복잡한 로직에 주석 추가 (예: `// 회원추가일 때 항상 초기화!`)
- **TODO 주석**: 개선 필요 사항 표시 (예: `// showToast의 message, setTimeout을 공통함수를 빼야함.`)

### 3. 코드 품질 향상 방안
- **중복 코드 제거**: 유사한 기능은 공통 함수로 추출
- **타입 안전성**: TypeScript 인터페이스 활용
- **명확한 함수명**: 함수의 목적을 명확히 하는 이름 사용

### 4. 확장성 고려
- **모듈화**: 기능별 파일 분리로 확장성 확보
- **재사용 가능한 컴포넌트**: props와 이벤트를 통한 컴포넌트 재사용
- **일관된 API 패턴**: CRUD 작업의 일관된 패턴 유지

## 개선 가능 사항
- **에러 처리 강화**: API 호출 시 에러 처리 로직 추가
- **단위 테스트 도입**: 컴포넌트 및 스토어 테스트 추가
- **코드 스플리팅**: 대규모 컴포넌트 분할
- **상수 분리**: 하드코딩된 문자열, URL 등을 상수로 분리
- **국제화(i18n)**: 다국어 지원 추가
- **Lazy Loading 도입**: 현재는 구현되어 있지 않으나, 라우터 기반 지연 로딩 도입 고려
