# 프로젝트 내의 코드 컨벤션

## 코드 컨벤션 및 특징

### 1. 파일 및 폴더 네이밍 컨벤션
**폴더명:**
- 기능/역할별 구분: `components`, `api`, `stores`, `assets` 등 복수형으로 표현
- 하위 폴더는 기능별 그룹핑: `components/popup/`
- 모두 소문자 사용 (kebab-case 또는 단일 단어)

**파일명:**
- **Vue 컴포넌트**: PascalCase 사용 (예: `UserTable.vue`, `HeaderSection.vue`)
  - 페이지 컴포넌트: `MainPage.vue`
  - 섹션 컴포넌트: `HeaderSection.vue`, `FooterSection.vue`
  - 기능 컴포넌트: `UserTable.vue`, `UserDetail.vue`
  - 팝업 컴포넌트: `UserEditPop.vue`, `CommonConfirmPop.vue`

- **TypeScript 파일:**
  - 스토어: `userStore.ts` (camelCase)
  - API 관련: `userApi.ts` (camelCase)
  - 타입 정의: `types.ts` (복수형, 일반명사)

- **CSS 파일**: 소문자 사용 (예: `style.css`)

### 2. 변수 네이밍 컨벤션
**접두사 규칙:**
- 파일 내의 전역 변수는 모두 `g_` 접두사 사용:
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

**상태 변수:**
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
**이벤트 핸들러**: `on` 접두사 사용, 이후 명사 두단어 이상
```javascript
function onBtnSubmit() { ... }
function onClickUser(idx) { ... }
function onWindowResizing() { ... }
```

**동작 함수**: 동사로 시작, 이후 명사 두단어 이상
```javascript
function showToast(msg) { ... }
function hideUserPop() { ... }
function formatPhone(e) { ... }
```

**API 호출 함수**: `req` 접두사 사용, 이후 명사 두단어 이상
```javascript
async function reqUserList(params) { ... }
async function reqInsertUser(user) { ... }
```

**콜백 함수**: `callback` 접두사 사용, 이후 명사 두단어 이상
```javascript
function callbackCommPopConfirm() { ... }
function callbackCommPopCancel() { ... }
```

### 4. 컴포넌트 구조 컨벤션
**파일 구조**: 일관된 순서로 구성
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

**Props 네이밍:**
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
**스코프 스타일**: `<style scoped>` 사용으로 컴포넌트 스타일 캡슐화

**클래스 네이밍**: 기능-요소 형태의 kebab-case 사용
```css
.modal-header { ... }
.form-row { ... }
.gender-radio-group { ... }
```

**반응형 디자인**: 미디어 쿼리를 통한 모바일 대응
```css
@media (max-width: 820px) {
  .layout-main {
    flex-direction: column;
  }
}
```

### 6. API 통신 컨벤션
**함수 구조**: 일관된 패턴 사용
```javascript
export async function reqUserList(params) {
  const { data } = await axios.post<UserListResponse>(
    `${BASE_URL}/member/getMemberList`,
    params || {}
  );
  return data;
}
```

**타입 안전성**: TypeScript 인터페이스 활용
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
**스토어 구조**: Composition API 스타일 사용
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
**코드 섹션 구분**: 명확한 구분선 사용
```javascript
// =========================
// API 서버 생존 여부
// =========================
```

**함수 설명**: JSDoc 스타일 주석
```javascript
/** 1. 회원 목록 조회 */
export async function reqUserList(params) { ... }
```

**TODO 주석**: 개선 필요 사항 표시
```javascript
// showToast의 message, setTimeout을 공통함수를 빼야함.
```

**인라인 주석**: 중요 로직 설명
```javascript
g_userDetail.gender = "M"; // 기본값
```

### 9. 파일 내 구조 컨벤션
- 파일 내의 전역변수, 상수 등은 전부 상단에 위치
- Vue 파일은 `script`, `template`, `style` 순으로 작성한다

### 10. 네이밍 기본 원칙
- 변수명은 모두 명사 2개 이상을 사용하여 작성한다
- 함수명은 동사+명사 2개 이상 조합으로 구성한다
- **함수명에 `handle` 사용 금지** - 너무 모호하므로 구체적인 동사 사용 (예: `show`, `log`, `retry`, `display`, `validate` 등)

---

## 추가 컨벤션 (확장 가능)

### 11. 상수 및 설정 컨벤션
**상수 네이밍**: 전체 대문자 및 언더스코어 사용
```javascript
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 10;
```

**환경별 설정 분리**:
```javascript
// config/constants.ts
export const CONFIG = {
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL,
    TIMEOUT: 5000
  },
  UI: {
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 300
  }
};
```

### 12. 에러 처리 컨벤션
**에러 객체 네이밍**: `Error` 접미사 사용
```javascript
class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const validationError = new ValidationError('필수 필드가 누락되었습니다.');
```

**에러 처리 함수**: 구체적인 동작 동사 사용 (`handle` 사용 금지)
```javascript
// ❌ 사용 금지 - handle은 너무 모호함
function handleApiError(error) { ... }
function handleValidationError(error) { ... }

// ✅ 권장 - 구체적인 동작 표현
function showApiError(error) { ... }
function logValidationError(error) { ... }
function retryApiRequest(error) { ... }
function displayErrorMessage(error) { ... }
```

### 13. 유틸리티 함수 컨벤션
**유틸리티 함수**: 동사+명사 조합, 순수 함수로 작성
```javascript
// utils/formatUtils.ts
export function formatPhoneNumber(phone) { ... }
export function validateEmailFormat(email) { ... }
export function parseQueryParams(url) { ... }
```

**날짜 관련 함수**: `format` 또는 `parse` 접두사
```javascript
function formatDateToKorean(date) { ... }
function parseISODateString(dateString) { ... }
```

### 14. 이벤트 네이밍 컨벤션
**커스텀 이벤트**: kebab-case 사용
```javascript
// 이벤트 발생
emit('user-updated', userData);
emit('modal-closed');
emit('data-loaded', responseData);

// 이벤트 리스닝
@user-updated="onUserUpdated"
@modal-closed="onModalClosed"
```

### 15. 라우터 컨벤션
**라우터 이름**: kebab-case 사용
```javascript
const routes = [
  { path: '/user-list', name: 'user-list', component: UserList },
  { path: '/user-detail/:id', name: 'user-detail', component: UserDetail }
];
```

**라우터 매개변수**: camelCase 사용
```javascript
// URL: /user-detail/123?tab=profile
const route = useRoute();
const userId = route.params.id;
const activeTab = route.query.tab;
```

### 16. 테스트 코드 컨벤션
**테스트 파일**: `.test.ts` 또는 `.spec.ts` 접미사
```
UserTable.vue → UserTable.test.ts
userApi.ts → userApi.spec.ts
```

**테스트 함수**: `describe`, `it`, `test` 사용
```javascript
describe('UserTable 컴포넌트', () => {
  it('사용자 목록을 올바르게 렌더링한다', () => { ... });
  it('사용자 클릭 시 상세 페이지로 이동한다', () => { ... });
});
```

### 17. 타입 정의 컨벤션
**인터페이스**: PascalCase + 명사 2개 이상
```typescript
export interface UserData {
  userId: number;
  userName: string;
  userEmail: string;
}

export interface ApiResponse {
  dataList: any[];
  messageText: string;
  successFlag: boolean;
}
```

**타입 별칭**: PascalCase + `Type` 접미사
```typescript
export type UserStatusType = 'active' | 'inactive' | 'pending';
export type ApiResponseType<T> = {
  dataList: T;
  messageText: string;
  successFlag: boolean;
};
```
